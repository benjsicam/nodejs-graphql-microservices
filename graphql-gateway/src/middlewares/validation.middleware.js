const ValidationMiddleware = {
  async Mutation(resolve, root, args, context, info) {
    const mutation = info.schema.getMutationType().getFields()[info.fieldName]
    const mutationValidationSchema = mutation.validationSchema

    if (mutationValidationSchema) {
      await mutationValidationSchema.validate(args, { strict: true, abortEarly: false })
    }

    return resolve(root, args, context, info)
  }
}

export default ValidationMiddleware
