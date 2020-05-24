const LogMiddleware = {
  async Query(resolve, root, args, context, info) {
    const { logger } = context
    const operation = info.fieldName

    logger.info(`query#${operation}.call %o`, args)

    const result = await resolve(root, args, context, info)

    logger.info(`query#${operation}.result %o`, result)

    return result
  },
  async Mutation(resolve, root, args, context, info) {
    const { logger } = context
    const operation = info.fieldName

    logger.info(`mutation#${operation}.call %o`, args)

    const result = await resolve(root, args, context, info)

    logger.info(`mutation#${operation}.result %o`, result)

    return result
  }
}

export default LogMiddleware
