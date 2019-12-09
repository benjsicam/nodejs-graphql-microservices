const LogMiddleware = {
  async Query(resolve, root, args, { logger }, info) {
    const operation = info.operation.name.value

    logger.info(`query#${operation}.call`, args)

    const result = await resolve(root, args, context, info)

    logger.info(`query#${operation}.result`, result)

    return result
  },
  async Mutation(resolve, root, args, { logger }, info) {
    const operation = info.operation.name.value

    logger.info(`mutation#${operation}.call`, args)

    const result = await resolve(root, args, context, info)

    logger.info(`mutation#${operation}.result`, result)

    return result
  }
}

export default LogMiddleware
