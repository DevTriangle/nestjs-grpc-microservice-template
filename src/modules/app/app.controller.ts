import { Controller, UseFilters } from '@nestjs/common'
import { AppService } from './app.service'
import { ApiTags } from '@nestjs/swagger'
import { AllExceptionsFilter } from 'src/common/filters/exception.filter'
import { GrpcMethod } from '@nestjs/microservices'
import { ServiceStatus } from 'src/proto/types/main/ServiceStatus'

@ApiTags('App')
@Controller('app')
@UseFilters(AllExceptionsFilter)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @GrpcMethod('AppService', 'GetStatus')
  getStatus(): ServiceStatus {
    return { status: true }
  }
}
