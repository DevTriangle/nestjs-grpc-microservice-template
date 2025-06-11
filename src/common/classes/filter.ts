import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsIn, IsInt, IsNumber, IsOptional, Min, ValidateNested } from 'class-validator'
import { i18nValidationMessage } from 'nestjs-i18n'
import { SortDirections } from '../constants/constants'
import { Type } from 'class-transformer'
import { ValidationErrors } from '../constants/validation'

export class PeriodFilter {
  @IsDate({ message: i18nValidationMessage(ValidationErrors.DATE_FORMAT) })
  @Type(() => Date)
  @IsOptional()
  @ApiProperty({ required: false })
  date_start?: Date

  @IsDate({ message: i18nValidationMessage(ValidationErrors.DATE_FORMAT) })
  @Type(() => Date)
  @IsOptional()
  @ApiProperty({ required: false })
  date_end?: Date
}

export class RangeFilter {
  @IsNumber({}, { message: i18nValidationMessage(ValidationErrors.NUMBER_FORMAT) })
  @IsOptional()
  @ApiProperty({ required: false })
  min?: number

  @IsNumber({}, { message: i18nValidationMessage(ValidationErrors.NUMBER_FORMAT) })
  @IsOptional()
  @ApiProperty({ required: false })
  max?: number
}

export class FilterOffset {
  @IsInt({ message: i18nValidationMessage(ValidationErrors.NUMBER_FORMAT) })
  @Min(1, { message: i18nValidationMessage('validation.min') })
  @IsOptional()
  @ApiProperty({ default: 50, required: false })
  count?: number

  @IsInt({ message: i18nValidationMessage(ValidationErrors.NUMBER_FORMAT) })
  @Min(1, { message: i18nValidationMessage('validation.min') })
  @IsOptional()
  @ApiProperty({ default: 1, required: false })
  page?: number
}

export class BaseFilter {
  @ValidateNested()
  @Type(() => FilterOffset)
  @IsOptional()
  @ApiProperty({ required: false })
  offset?: FilterOffset
}

export class BaseSorts {
  @IsIn(SortDirections, { message: i18nValidationMessage(ValidationErrors.IN) })
  @IsOptional()
  @ApiProperty({ default: SortDirections[0], required: false })
  created_at?: 'ASC' | 'DESC'

  @IsIn(SortDirections, { message: i18nValidationMessage(ValidationErrors.IN) })
  @IsOptional()
  @ApiProperty({ default: SortDirections[0], required: false })
  updated_at?: 'ASC' | 'DESC'
}

export class BaseFilters {
  @ValidateNested()
  @Type(() => PeriodFilter)
  @IsOptional()
  @ApiProperty({ required: false })
  created_at?: PeriodFilter

  @ValidateNested()
  @Type(() => PeriodFilter)
  @IsOptional()
  @ApiProperty({ required: false })
  updated_at?: PeriodFilter
}

export class InternalSyncFilter extends BaseFilter {
  @IsOptional()
  @ApiProperty({ required: false })
  filter?: any
}
