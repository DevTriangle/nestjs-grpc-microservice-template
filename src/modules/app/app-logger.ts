import { LoggerService } from '@nestjs/common'
import { createConsola } from 'consola'

export class AppLogger implements LoggerService {
  consola = createConsola({
    reporters: [
      {
        log: (logObj) => {
          console.log(JSON.stringify(logObj))
        },
      },
    ],
  })

  log(message: any, ...optionalParams: any[]) {
    this.consola.info(message, optionalParams)
  }

  fatal(message: any, ...optionalParams: any[]) {
    this.consola.fatal(message, optionalParams)
  }

  error(message: any, ...optionalParams: any[]) {
    this.consola.error(message, optionalParams)
  }

  warn(message: any, ...optionalParams: any[]) {
    this.consola.warn(message, optionalParams)
  }

  debug?(message: any, ...optionalParams: any[]) {
    this.consola.debug(message, optionalParams)
  }

  verbose?(message: any, ...optionalParams: any[]) {
    this.consola.verbose(message, optionalParams)
  }
}
