import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { I18nModule, AcceptLanguageResolver } from 'nestjs-i18n'
import configuration from 'src/config/configuration'
import { TypeOrmModule } from '@nestjs/typeorm'

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
  providers: [AppService],
})
export class AppModule {}
