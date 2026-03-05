import { RpcException } from '@nestjs/microservices'
import { I18nService } from 'nestjs-i18n'
import { ErrorCodes } from 'src/common/constants/constants'

export function validateSignatureTimestamp(timestamp: number, i18n: I18nService): void {
  const now = Date.now()
  const MAX_TIME_DIFF_MS = 1 * 60 * 1000 // 1 minute

  if (Math.abs(now - timestamp) > MAX_TIME_DIFF_MS) {
    throw new RpcException({
      code: 16,
      message: i18n.t('errors.service_auth_error', {
        args: { error: ErrorCodes.SIGNATURE_EXPIRED },
      }),
    })
  }
}
