import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app/app.module'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common'
import { formatConstraints } from './common/utils/format-constraints'
import { AppLogger } from './modules/app/app-logger'
import { join } from 'path'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    logger: process.env.DISABLE_LOGGER === 'true' ? undefined : new AppLogger(),
    transport: Transport.GRPC,
    options: {
      package: ['main'],
      protoPath: [join(__dirname, './proto/main.proto')],
      url: process.env.GRPC_HOST,
      protoLoader: '@grpc/proto-loader',
    },
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
