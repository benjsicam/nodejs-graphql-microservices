const LogMiddleware = {
  async Query(resolve, root, args, context, info) {
    const { logger } = context
    const operation = info.fieldName

    logger.info(`query#${operation}.call`, args)

    const result = await resolve(root, args, context, info)

    logger.info(`query#${operation}.result`, result)

    return result
  },
  async Mutation(resolve, root, args, context, info) {
    const { logger } = context
    const operation = info.fieldName

    logger.info(`mutation#${operation}.call`, args)

    const result = await resolve(root, args, context, info)

    logger.info(`mutation#${operation}.result`, result)

    return result
  },
  async Subscription(resolve, root, args, context, info) {
    const { logger } = context
    const operation = info.fieldName

    logger.info(`subscription#${operation}.call`, args)

    return resolve(root, args, context, info)
  }
}

export default LogMiddleware
