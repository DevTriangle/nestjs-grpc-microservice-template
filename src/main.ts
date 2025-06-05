import { NestFactory } from '@nestjs/core'
import { AppModule } from './modules/app/app.module'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    // options: {
    //   package: 'hero',
    //   protoPath: join(__dirname, 'hero/hero.proto'),
    // },
  })
  await app.listen()
}

void bootstrap()
