import * as yup from 'yup'

import { map, groupBy } from 'lodash'

const ValidationMiddleware = {
  async Mutation(resolve, root, args, context, info) {
    const mutationField = info.schema.getMutationType().getFields()[info.fieldName]
    const mutationValidationSchema = mutationField.validationSchema

    if (mutationValidationSchema) {
      const errors = []
      try {
        await mutationValidationSchema.validate(args, { strict: true, abortEarly: false })
      } catch (error) {
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
          if (errors.length > 0) return { errors }
        } else {
          throw error
        }
      }
    }

    return resolve(root, args, context, info)
  }
}

export default ValidationMiddleware
