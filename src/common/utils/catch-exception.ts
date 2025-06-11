import { HttpException, HttpStatus, Logger } from '@nestjs/common'
import { DatabaseErrorCodes } from '../constants/constants'
import { QueryFailedError } from 'typeorm'
import { I18nService } from 'nestjs-i18n'
import { v4 as uuidv4 } from 'uuid'

const dataBaseLogger = new Logger('Database')

export function catchException(error: any, i18n: I18nService): void {
  Logger.error(error)

  if (error instanceof QueryFailedError) {
    catchDatabaseException(error, i18n)
  } else {
    if (error.status !== HttpStatus.INTERNAL_SERVER_ERROR && error.status !== undefined) {
      throw new HttpException(error.message, error.status ?? HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error,
      })
    } else {
      throw new HttpException(
        { message: i18n.t('errors.error', { args: { id: uuidv4() } }) },
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error,
        },
      )
    }
  }
}

export function catchDatabaseException(error: any, i18n: I18nService): void {
  if (error?.code === DatabaseErrorCodes.FK) {
    const [field, id] = getDetailsKeyValue(error?.detail)

    throw new HttpException(
      { property: field, message: i18n.t(`errors.fk.${field}`, { args: { id } }) },
      HttpStatus.NOT_FOUND,
      {
        cause: error,
      },
    )
  } else if (error?.code === DatabaseErrorCodes.UNIQUE) {
    const [field, id] = getDetailsKeyValue(error?.detail)
    throw new HttpException(
      { property: field, message: i18n.t(`errors.uq.exists`, { args: { id: id } }) },
      HttpStatus.CONFLICT,
      {
        cause: error,
      },
    )
  } else {
    dataBaseLogger.error(error.message)
    throw new HttpException(
      { message: i18n.t(`errors.database.query_failed`, { args: { id: uuidv4() } }) },
      HttpStatus.INTERNAL_SERVER_ERROR,
      {
        cause: error,
      },
    )
  }
}

function getDetailsKeyValue(detail: string): [string, string] {
  try {
    const keyRegExp = /(Key|Ключ) \((.+)\)=\((.+)\)/

    const fieldMatch = keyRegExp.exec(detail)
    const field = fieldMatch?.[2].trim() ?? ''
    const id = fieldMatch?.[3].trim() ?? ''

    return [field, id]
  } catch (error) {
    Logger.error(`FIELD MATCH ERROR: ${detail}`)
    throw new HttpException(error.message, error.status ?? HttpStatus.INTERNAL_SERVER_ERROR, {
      cause: error,
    })
  }
}
