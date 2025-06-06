import { Controller } from '@nestjs/common'
import { AppService } from './app.service'
import { ApiTags } from '@nestjs/swagger'
import { AppServiceController, ServiceStatus } from 'src/proto/types/main'
import { GrpcMethod } from '@nestjs/microservices'

@ApiTags('App')
@Controller('app')
export class AppController implements AppServiceController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('AppService', 'GetStatus')
  getStatus(): ServiceStatus {
    return { status: true }
  }
}
