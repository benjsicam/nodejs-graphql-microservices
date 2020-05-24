import Aigle from 'aigle'

import * as yup from 'yup'

import { keys } from 'lodash'

const { each, groupBy } = Aigle

const errorUtils = {
  async buildError(error) {
    const errors = []

    if (error instanceof yup.ValidationError) {
      const fieldErrors = await groupBy(error.inner, 'path')
      const fields = keys(fieldErrors)

      await each(fields, async (field) => {
        const errorsHolder = []

        await each(fieldErrors[field], (fieldError) => {
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
