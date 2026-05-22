import { BaseQueryBuilder } from 'nestjs-typeorm-shared'
import { ObjectLiteral } from 'typeorm'

export class AppQueryBuilder<T extends ObjectLiteral> extends BaseQueryBuilder<T> {}
