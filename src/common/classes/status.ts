import { ApiProperty } from '@nestjs/swagger'

export class StatusResponse {
  @ApiProperty()
  status: boolean

  @ApiProperty({ required: false })
  message?: string
}
