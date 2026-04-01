import { Metadata } from '@grpc/grpc-js'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RpcException } from '@nestjs/microservices'
import { createHmac } from 'crypto'
import { I18nService } from 'nestjs-i18n'
import { ErrorCodes, SERVICE_NAME } from 'src/common/constants/constants'
import { validateSignatureTimestamp } from 'src/common/utils/crypto/validate-signature'

@Injectable()
export class ServiceTokenGuard implements CanActivate {
  constructor(
    private readonly i18n: I18nService,
    private readonly config: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const type = context.getType()
    if (type !== 'rpc') {
      return false
    }

    const metadata: Metadata | undefined = context.getArgByIndex(1)
    if (!metadata) {
      throw new RpcException({
        code: 16,
        message: this.i18n.t('errors.auth.service_error', {
          args: { error: ErrorCodes.NO_METADATA },
        }),
      })
    }

    return this.validateSignature(metadata)
  }

  private validateSignature(metadata: Metadata): boolean {
    const serviceToken = this.config.get('service_token')
    if (!serviceToken) return false

    const receivedSignature = metadata.get('x-signature')[0].toString()
    const timestamp = metadata.get('x-timestamp')[0].toString()
    const expectedSignature = createHmac('sha256', serviceToken)
      .update(`${SERVICE_NAME}:${timestamp}`)
      .digest('hex')
    validateSignatureTimestamp(parseInt(timestamp), this.i18n)

    if (receivedSignature !== expectedSignature) {
      throw new RpcException({
        code: 16,
        message: this.i18n.t('errors.auth.service_error', {
          args: { error: ErrorCodes.WRONG_SIGNATURE },
        }),
      })
    }

    return true
  }
}
