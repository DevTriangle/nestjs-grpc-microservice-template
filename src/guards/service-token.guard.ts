import { Metadata, MetadataValue } from '@grpc/grpc-js'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RpcException } from '@nestjs/microservices'
import { I18nService } from 'nestjs-i18n'

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
        message: this.i18n.t('errors.service_auth_error'),
      })
    }

    const secret: MetadataValue[] = metadata.get('x-internal-secret')
    if (secret[0] !== this.config.get('service_token')) {
      throw new RpcException({
        code: 16,
        message: this.i18n.t('errors.service_auth_error'),
      })
    }

    return true
  }
}
