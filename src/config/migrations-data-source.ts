import { DataSource } from 'typeorm'
import { config as dotenvConfig } from 'dotenv'

dotenvConfig({ path: '.env' })

export const MigrationsDataSource = new DataSource({
  type: 'postgres',
  host: `${process.env.DB_HOST}`,
  port: Number(process.env.DB_PORT ?? 5432),
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
  entities: ['dist/modules/**/entities/*.entity{.ts,.js}'],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
})
