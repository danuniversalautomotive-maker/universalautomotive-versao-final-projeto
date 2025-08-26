/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
import IsSqlInjectionSafe from './functions/sqlInjectionSafe'

export interface dataset {
  [key: string]: any
}
export interface validatorResult {
  valid: boolean
  key: string
  message: string
}

export interface ValidatorTemplate {
  [key: string]: Array<(data: any, key: string) => validatorResult>
}

export default class Validator {
  constructor(private dataset: dataset, private template: ValidatorTemplate) {}

  validateAll(): validatorResult[] {
    const { template } = this
    let results: validatorResult[] = []

    for (const key in template) {
      results = [...results, ...this.validateSingle(key)]
    }

    return results
  }

  validateSingle(key: string): validatorResult[] {
    const { template } = this
    const { dataset } = this
    const results: validatorResult[] = []

    for (const validator_cb of template[key]) {
      let result: validatorResult

      try {
        result = validator_cb(dataset[key], key)
      } catch (error) {
        result = {
          key,
          message: 'evaluation error',
          valid: false,
        }
      }

      results.push(result)
    }

    return results
  }

  isValid(key: string) {
    const result = this.validateSingle(key)
    const err = result.filter((v) => !v.valid)

    return err.length === 0
  }

  // --- Validators ---

  static required(value: any, key: string): validatorResult {
    value = typeof value === 'string' ? value.trim() : value

    const valid: boolean = value != '' && value != undefined && value != null
    const message = valid ? 'Valid' : `"${key}" is required`

    return {
      valid,
      message,
      key,
    }
  }

  static inArray(array: any[], failMessage = 'invalid') {
    const validator_cb = (value: any, key: string): validatorResult => {
      const valid = array.includes(value)
      const message = !valid ? `${failMessage} ${key}` : ''

      return {
        valid,
        message,
        key,
      }
    }

    return validator_cb.bind(this)
  }

  static sqlInjectionSafe(value: string, key: string): validatorResult {
    const valid = IsSqlInjectionSafe(value)
    const message = valid ? 'Valid' : `Invalid`

    return {
      valid,
      message,
      key,
    }
  }

  static AdressNumber(value: string, key: string): validatorResult {
    const valid = parseInt(value) >= 0
    const message = valid ? 'Valid' : `The number field is invalid`

    return {
      valid,
      message,
      key,
    }
  }

}
