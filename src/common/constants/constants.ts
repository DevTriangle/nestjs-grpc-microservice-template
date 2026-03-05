export const SERVICE_NAME = 'NOTIFICATION'
export const SortDirections = ['ASC', 'DESC']

export enum ErrorLevels {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export enum DefaultPaginationEnum {
  COUNT = 50,
  SM_COUNT = 10,
  PAGE = 1,
}

export enum DatabaseErrorCodes {
  FK = '23503',
  UNIQUE = '23505',
}

export enum ErrorCodes {
  NO_METADATA = 1,
  NO_TOKEN = 2,
  SIGNATURE_EXPIRED = 3,
  WRONG_SIGNATURE = 4,
}
