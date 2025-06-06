import { Controller } from '@nestjs/common'
import { AppService } from './app.service'
import { ApiTags } from '@nestjs/swagger'
import { GrpcMethod } from '@nestjs/microservices'
import { ServiceStatus } from 'src/proto/types/main/ServiceStatus'

@ApiTags('App')
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('AppService', 'GetStatus')
  getStatus(): ServiceStatus {
    return { status: true }
  }
}
