export const ValidationErrors = {
  IN: 'validation.in',
  STRING_FORMAT: 'validation.string_format',
  EMAIL_FORMAT: 'validation.email_format',
  NUMBER_FORMAT: 'validation.number_format',
  DECIMAL_FORMAT: 'validation.decimal_format',
  DATE_FORMAT: 'validation.date_format',
  BOOLEAN_FORMAT: 'validation.boolean_format',
  PHONE_FORMAT: 'validation.phone_format',
  UUID_FORMAT: 'validation.uuid_format',
  JSON_FORMAT: 'validation.json_format',
  ARRAY_FORMAT: 'validation.array_format',
  URL_FORMAT: 'validation.url_format',
  BASE64_FORMAT: 'validation.base64_format',
  OBJECT_FORMAT: 'validation.object_format',
  EMPTY: 'validation.empty',
  NOT_EMPTY: 'validation.not_empty',
  MAX_LENGTH: 'validation.max_length',
  MIN: 'validation.min',
  MAX: 'validation.max',
  ARRAY_MIN_SIZE: 'validation.array_min_size',
}

export enum StringMaxLength {
  TEXT_1000 = 1000,
  LONG_TEXT = 2000,
  CONTENT_TEXT = 5000,
}
