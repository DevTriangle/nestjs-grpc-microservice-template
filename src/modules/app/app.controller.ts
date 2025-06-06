import { Controller } from '@nestjs/common'
import { AppService } from './app.service'
import { AppServiceController, ServiceStatus } from 'src/proto/types/main'
import { GrpcMethod } from '@nestjs/microservices'

@Controller('app')
export class AppController implements AppServiceController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('AppService', 'GetStatus')
  getStatus(): ServiceStatus {
    return { status: true }
  }
}
