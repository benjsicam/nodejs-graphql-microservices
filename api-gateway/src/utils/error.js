import * as yup from 'yup'

import { forEach, groupBy, keys } from 'lodash'

const errorUtils = {
  async buildError(error) {
    const errors = []

    if (error instanceof yup.ValidationError) {
      const fieldErrors = groupBy(error.inner, 'path')
      const fields = keys(fieldErrors)

      forEach(fields, async field => {
        const errorsHolder = []

        forEach(fieldErrors[field], fieldError => {
          errorsHolder.push(fieldError.errors[0])
        })

        errors.push({
          field,
          message: errorsHolder
        })
      })
    } else {
      errors.push({
        field: '',
        message: [error.message]
      })
    }

    return errors
  }
}

export default errorUtils
