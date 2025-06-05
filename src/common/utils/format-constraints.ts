import { ValidationError } from 'class-validator'
import { ExceptionModel } from 'src/common/classes/exception'

export function formatConstraints(validationErrors: ValidationError[]) {
  const formattedErrors: ExceptionModel[] = []

  validationErrors.forEach((error) => {
    if ((error.children?.length ?? 0) > 0) {
      const childrenErrors = formatConstraints(error.children ?? [])
      formattedErrors.push(...childrenErrors)
    } else {
      const objectConstraints = Object.values<string>(error.constraints ?? {})

      for (const e of objectConstraints) {
        formattedErrors.push({ error: e, property: error.property })
      }
    }
  })

  return formattedErrors
}
