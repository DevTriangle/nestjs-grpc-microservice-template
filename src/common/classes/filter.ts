import { IsDate, IsIn, IsInt, IsNumber, IsOptional, Min, ValidateNested } from 'class-validator'
import { i18nValidationMessage } from 'nestjs-i18n'
import { SortDirections } from '../constants/constants'
import { Type } from 'class-transformer'
import { ValidationErrors } from '../constants/validation'

export class PeriodFilter {
  @IsDate({ message: i18nValidationMessage(ValidationErrors.DATE_FORMAT) })
  @Type(() => Date)
  @IsOptional()
  date_start?: Date

  @IsDate({ message: i18nValidationMessage(ValidationErrors.DATE_FORMAT) })
  @Type(() => Date)
  @IsOptional()
  date_end?: Date
}

export class RangeFilter {
  @IsNumber({}, { message: i18nValidationMessage(ValidationErrors.NUMBER_FORMAT) })
  @IsOptional()
  min?: number

  @IsNumber({}, { message: i18nValidationMessage(ValidationErrors.NUMBER_FORMAT) })
  @IsOptional()
  max?: number
}

export class FilterOffset {
  @IsInt({ message: i18nValidationMessage(ValidationErrors.NUMBER_FORMAT) })
  @Min(1, { message: i18nValidationMessage('validation.min') })
  @IsOptional()
  count?: number

  @IsInt({ message: i18nValidationMessage(ValidationErrors.NUMBER_FORMAT) })
  @Min(1, { message: i18nValidationMessage('validation.min') })
  @IsOptional()
  page?: number
}

export class BaseFilter {
  @ValidateNested()
  @Type(() => FilterOffset)
  @IsOptional()
  offset?: FilterOffset
}

export class BaseSorts {
  @IsIn(SortDirections, { message: i18nValidationMessage(ValidationErrors.IN) })
  @IsOptional()
  created_at?: 'ASC' | 'DESC'

  @IsIn(SortDirections, { message: i18nValidationMessage(ValidationErrors.IN) })
  @IsOptional()
  updated_at?: 'ASC' | 'DESC'
}

export class BaseFilters {
  @ValidateNested()
  @Type(() => PeriodFilter)
  @IsOptional()
  created_at?: PeriodFilter

  @ValidateNested()
  @Type(() => PeriodFilter)
  @IsOptional()
  updated_at?: PeriodFilter
}

export class InternalSyncFilter extends BaseFilter {
  @IsOptional()
  filter?: any
}
