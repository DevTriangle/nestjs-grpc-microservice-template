import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { Request, Response } from 'express'
import { I18nContext } from 'nestjs-i18n'
import { createConsola } from 'consola'
import { ConfigService } from '@nestjs/config'
import { ExceptionMessageModel, ExceptionModel } from '../classes/exception'
import { ErrorLevels } from '../constants/constants'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  consola = createConsola({
    reporters: [
      {
        log: (logObj) => {
          console.log(JSON.stringify(logObj))
        },
      },
    ],
  })

  exceptionLogger = new Logger('EXCEPTION')

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly config: ConfigService,
  ) {}

  formatErrorArray(errors: any[], i18n?: I18nContext): ExceptionMessageModel[] {
    try {
      return errors.map((message: ExceptionModel) => {
        const property = message.property ?? undefined
        const level = message.level ?? ErrorLevels.ERROR
        const args = JSON.parse(message.error.split('|')[1] ?? '{}')

        const error: string =
          i18n?.t(message.error.split('|')[0], { args: { ...args, property } }) ?? ''
        return { message: error, level: level, property: property }
      })
    } catch (error) {
      this.consola.error(error)
      return [{ message: error.message, level: ErrorLevels.ERROR, property: undefined }]
    }
  }

  catch(exception: any, host: ArgumentsHost) {
    const i18n = I18nContext.current(host)
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    try {
      const httpStatus =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR

      const exceptionCause = exception.cause ?? exception
      if (this.config.get('disable_logger') === 'true') {
        console.log(exceptionCause)
      } else {
        this.consola.log(exceptionCause)
      }

      const errors = this.formatException(exception, i18n)

      const errorMessage = i18n?.t(exception?.response?.error ?? '', {
        defaultValue:
          exception?.cause?.options?.description ?? i18n.t('errors.internal_server_error'),
      })

      const responseBody = {
        message: errorMessage,
        url: request.url,
        method: request.method,
        errors: errors,
        statusCode: httpStatus,
      }

      this.consola.error(
        `\nMETHOD: ${request.method} ${request.url}\nMESSAGE: ${exception?.message}\nERRORS: ${errors.map((e) => e.message)}`,
      )

      try {
        httpAdapter.reply(response, responseBody, httpStatus)
      } catch (error) {
        httpAdapter.reply(response, responseBody, HttpStatus.INTERNAL_SERVER_ERROR)
        this.exceptionLogger.error(error)
      }
    } catch (error) {
      const errorMessage = i18n?.t('errors.errors', { args: { id: -1 } }) ?? ''

      const responseBody = {
        text: errorMessage,
        url: request.url,
        method: request.method,
        error: [],
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      }

      httpAdapter.reply(response, responseBody, HttpStatus.INTERNAL_SERVER_ERROR)
      this.exceptionLogger.error(error)
    }
  }

  formatException(exception: any, i18n?: I18nContext): ExceptionMessageModel[] {
    const errors: ExceptionMessageModel[] = []
    const exceptionCause = this.getCause(exception)

    if (
      exception.status === HttpStatus.BAD_REQUEST &&
      ((exception?.response?.message && Array.isArray(exception?.response?.message)) ||
        (exceptionCause?.response && Array.isArray(exceptionCause?.response)))
    ) {
      // Ошибки валидации
      const formattedErrors = this.formatErrorArray(
        exception?.response?.message ?? exceptionCause?.response,
        i18n,
      )
      errors.push(...formattedErrors)
    } else {
      const errorProperty =
        exception?.response?.property ??
        exception?.cause?.response?.property ??
        exception?.property ??
        null

      // Остальные ошибки
      errors.push({
        message: i18n?.t(exception?.message ?? 'errors.internal_server_error') ?? '',
        level: ErrorLevels.ERROR,
        property: errorProperty,
        detailed_info:
          i18n?.t(
            exceptionCause?.message ??
              exceptionCause?.[0]?.message ??
              'errors.internal_server_error',
          ) ?? '',
      })
    }

    return errors
  }

  getCause(exception: any) {
    if (exception?.cause) {
      return this.getCause(exception?.cause)
    } else {
      return exception
    }
  }
}
