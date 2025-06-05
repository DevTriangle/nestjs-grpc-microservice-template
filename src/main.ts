import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app/app.module'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common'
import { formatConstraints } from './common/utils/format-constraints'

async function bootstrap(): Promise<void> {
  // const configService = app.get(ConfigService)
  // const port = configService.get('port')

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        try {
          const formattedErrors = formatConstraints(validationErrors)

          return new BadRequestException(formattedErrors, {
            description: 'errors.bad_request',
          })
        } catch (error) {
          console.log(error)
        }
      },
    }),
  )

  await app.listen()
}

void bootstrap()
