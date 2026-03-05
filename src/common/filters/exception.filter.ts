import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { I18nContext, I18nService } from 'nestjs-i18n'
import { createConsola } from 'consola'
import { ConfigService } from '@nestjs/config'
import { ExceptionMessageModel, RpcErrorResponse } from '../classes/exception'
import { ErrorLevels } from '../constants/constants'
import { getCause } from '../utils/exception-cause'
import { throwError } from 'rxjs'
import { Metadata } from '@grpc/grpc-js'
import { formatExceptionErrors } from '../utils/errors/format-error-response'

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
    private readonly config: ConfigService,
    private readonly i18n: I18nService,
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    try {
      const i18n: I18nService = I18nContext.current(host)?.service ?? this.i18n

      const httpStatus =
        exception instanceof HttpException
          ? exception.getStatus()
          : HttpStatus.INTERNAL_SERVER_ERROR

      const cause = getCause(exception)
      const errorMessage: string = i18n.t(cause.message ?? '', {
        defaultValue: i18n.t('errors.internal_server_error'),
      })

      const errors = formatExceptionErrors(exception, i18n)

      const metadata: Metadata = new Metadata()
      metadata.add('errors-bin', Buffer.from(JSON.stringify(errors)))
      metadata.add('status', httpStatus.toString())

      const exceptionResponse: RpcErrorResponse = {
        message: errorMessage,
        metadata: metadata,
      }

      this.logError(exception, exceptionResponse)
      return throwError(() => exceptionResponse)
    } catch (error) {
      const errorData: ExceptionMessageModel = {
        message: error.message,
        detailed_info: error,
        level: ErrorLevels.ERROR,
      }
      const metadata: Metadata = new Metadata()
      metadata.add('errors-bin', Buffer.from(JSON.stringify([errorData])))
      metadata.add('status', HttpStatus.INTERNAL_SERVER_ERROR.toString())

      const exceptionResponse: RpcErrorResponse = {
        message: 'Unexpected Error',
        metadata: metadata,
      }

      this.logError(error, exceptionResponse)
      return throwError(() => exceptionResponse)
    }
  }

  private logError(exception: any, response: RpcErrorResponse): void {
    const exceptionCause = getCause(exception)
    if (this.config.get('disable_logger') === 'true') {
      console.log(exceptionCause)
    } else {
      this.consola.log(exceptionCause, response)
    }
  }
}
