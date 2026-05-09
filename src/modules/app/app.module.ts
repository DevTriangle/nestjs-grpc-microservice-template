import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration from 'src/config/configuration'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AcceptLanguageResolver, I18nModule, I18nService } from 'nestjs-i18n'
import { RpcExceptionsFilter, RpcServiceTokenGuard } from 'nestjs-typeorm-shared'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'ru',
      fallbacks: {
        'ru-*': 'ru',
      },
      loaderOptions: {
        path: `./dist/i18n/`,
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('db_host'),
        port: config.get('db_port'),
        username: config.get('db_username'),
        password: config.get('db_password'),
        database: config.get('db_name'),
        entities: ['dist/modules/**/entities/*.entity{.ts,.js}'],
        autoLoadEntities: false,
        synchronize: false,
        migrationsRun: false,
        logging: false,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useFactory: (i18n: I18nService, config: ConfigService): RpcServiceTokenGuard => {
        return new RpcServiceTokenGuard(i18n, {
          serviceToken: config.get('service_token'),
          serviceName: config.get('service_name'),
          maxTimeDiffMs: config.get('service_token_max_time_diff_ms'),
        })
      },
      inject: [I18nService, ConfigService],
    },
    {
      provide: APP_FILTER,
      useFactory: (i18n: I18nService, config: ConfigService): RpcExceptionsFilter => {
        return new RpcExceptionsFilter(i18n, {
          disableLogFormatting: config.get('disable_logger') === 'true',
        })
      },
      inject: [I18nService, ConfigService],
    },
  ],
})
export class AppModule {}
