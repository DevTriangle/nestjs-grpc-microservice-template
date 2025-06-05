export class ExceptionModel {
  error: string
  level?: string
  property?: string
}

export class ExceptionMessageModel {
  [key: string]: string | undefined
  message: string
  level: string
  property?: string
  detailed_info?: string
}
export class ErrorResponse {
  message: string
  url: string
  method: string
  errors: ExceptionMessageModel[]
  statusCode: number
}
