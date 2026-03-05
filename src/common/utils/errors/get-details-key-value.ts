import { Logger, HttpException, HttpStatus } from '@nestjs/common'

export function getDetailsKeyValue(detail: string): [string, string] {
  try {
    const regExp = /(Key|Ключ) "?\((.+)\)=\((.+)\)"?/
    const fieldMatch = regExp.exec(detail)
    const field = fieldMatch?.[2]?.trim()
    const id = fieldMatch?.[3]?.trim()

    return [field ?? '', id ?? '']
  } catch (error) {
    Logger.error(`FIELD MATCH ERROR: ${detail}`)
    throw new HttpException(error.message, error.status ?? HttpStatus.INTERNAL_SERVER_ERROR, {
      cause: error,
    })
  }
}
