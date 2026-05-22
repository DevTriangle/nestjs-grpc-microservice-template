import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app/app.module'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common'
import { ReflectionService } from '@grpc/reflection'
import { AppLogger, formatErrors, getInitProtoFiles } from 'nestjs-typeorm-shared'

async function bootstrap(): Promise<void> {
  const { packages, protoPaths, includeDir } = getInitProtoFiles({
    dirPath: './libs/asur-task-shared-types/src/proto/',
  })

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    logger: process.env.DISABLE_LOGGER === 'true' ? undefined : new AppLogger(),
    transport: Transport.GRPC,
    options: {
      package: packages,
      protoPath: protoPaths,
      url: process.env.GRPC_HOST,
      loader: {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
        includeDirs: [includeDir],
      },
      onLoadPackageDefinition: (pkg, server) => {
        new ReflectionService(pkg).addToServer(server)
      },
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
      exceptionFactory: (validationErrors: ValidationError[] = []): BadRequestException => {
        try {
          const formattedErrors = formatErrors(validationErrors)

          return new BadRequestException(formattedErrors, {
            description: 'errors.bad_request',
          })
        } catch (error) {
          console.log(error)
          return new BadRequestException([], {
            description: 'errors.bad_request',
          })
        }
      },
    }),
  )

  await app.listen()
}

void bootstrap()
