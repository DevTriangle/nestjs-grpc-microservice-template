import { Controller, UseFilters } from '@nestjs/common'
import { AppService } from './app.service'
import { ApiTags } from '@nestjs/swagger'
import { AllExceptionsFilter } from 'src/common/filters/exception.filter'

@ApiTags('app')
@Controller('app')
@UseFilters(AllExceptionsFilter)
export class AppController {
  constructor(private readonly appService: AppService) {}
}
