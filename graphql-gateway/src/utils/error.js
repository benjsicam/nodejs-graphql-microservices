import * as yup from 'yup'

import { map, groupBy } from 'lodash'

const errorUtils = {
  async buildError(error) {
    const errors = []

    if (error instanceof yup.ValidationError) {
      const fieldErrors = groupBy(error.inner, 'path')
      const fields = Object.keys(fieldErrors)

      await Promise.all(
        map(fields, async field => {
          const errorsHolder = []
          await Promise.all(
            map(fieldErrors[field], fieldError => {
              errorsHolder.push(fieldError.errors[0])
            })
          )
          errors.push({
            message: errorsHolder,
            field
          })
        })
      )
      return { errors }
    }
    return {
      errors: [
        {
          field: null,
          message: [error.message]
        }
      ]
    }
  }
}

export default errorUtils
