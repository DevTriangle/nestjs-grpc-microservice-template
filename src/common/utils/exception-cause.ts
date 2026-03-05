export function getCause(exception: any): any {
  if (exception?.cause) {
    return getCause(exception?.cause)
  } else {
    return exception
  }
}
