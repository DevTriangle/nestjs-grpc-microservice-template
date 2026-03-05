import { BadRequestException, HttpStatus, Logger } from '@nestjs/common'
import { I18nContext, I18nService } from 'nestjs-i18n'
import { ExceptionMessageModel } from 'src/common/classes/exception'
import { DatabaseErrorCodes, ErrorLevels } from 'src/common/constants/constants'
import { v7 as uuidv7 } from 'uuid'
import { QueryFailedError } from 'typeorm'
import { getDetailsKeyValue } from './get-details-key-value'
import { getCause } from '../exception-cause'

const dataBaseLogger = new Logger('Database')

export function formatExceptionErrors(
  exception: any,
  i18n: I18nContext | I18nService,
): ExceptionMessageModel[] {
  const errors: ExceptionMessageModel[] = []
  if (exception instanceof QueryFailedError) {
    const databaseErrors = formatDatabaseException(exception, i18n)
    errors.push(...databaseErrors)
  } else if (exception instanceof BadRequestException) {
    const badRequestErrors = formatBadRequestException(exception, i18n)
    errors.push(...badRequestErrors)
  } else {
    if (exception.status !== HttpStatus.INTERNAL_SERVER_ERROR && exception.status !== undefined) {
      errors.push({ message: exception.message, level: ErrorLevels.ERROR })
    } else {
      const cause = getCause(exception)
      errors.push({
        message: i18n.t('errors.error', { args: { id: uuidv7() } }),
        level: ErrorLevels.ERROR,
        detailed_info: cause.message,
      })
    }
  }

  return errors
}

export function formatDatabaseException(
  exception: any,
  i18n: I18nContext | I18nService,
): ExceptionMessageModel[] {
  const errors: ExceptionMessageModel[] = []

  if (exception?.code === DatabaseErrorCodes.FK) {
    const [field, id] = getDetailsKeyValue(exception?.detail)

    errors.push({
      message: i18n.t(`errors.fk.${field}`, { args: { id } }),
      property: field,
      level: ErrorLevels.ERROR,
    })
  } else if (exception?.code === DatabaseErrorCodes.UNIQUE) {
    const [field, id] = getDetailsKeyValue(exception?.detail)

    errors.push({
      message: i18n.t('errors.uq.exists', { args: { id } }),
      property: field,
      level: ErrorLevels.ERROR,
    })
  } else {
    dataBaseLogger.error(exception.message)

    errors.push({
      message: i18n.t(`errors.database.query_failed`, { args: { id: uuidv7() } }),
      level: ErrorLevels.ERROR,
      detailed_info: exception.message,
    })
  }

  return errors
}

export function formatBadRequestException(
  exception: BadRequestException,
  i18n: I18nContext | I18nService,
): ExceptionMessageModel[] {
  const errors: ExceptionMessageModel[] = []

  const response = exception.getResponse() as any
  for (const error of response.message) {
    const errorMessage: string = error.error

    const args = JSON.parse(errorMessage.split('|')[1] ?? '{}')
    const errorText: string = i18n.t(errorMessage.split('|')[0], {
      args: { ...args, property: error.property },
    })

    errors.push({ message: i18n.t(errorText), property: error.property, level: ErrorLevels.ERROR })
  }

  return errors
}
