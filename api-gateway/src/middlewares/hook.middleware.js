const HookMiddleware = {
  async Mutation (resolve, root, args, context, info) {
    const { logger, eventsBus } = context
    const operation = info.fieldName

    const result = await resolve(root, args, context, info)

    logger.info(`Publish event on mutation#${operation}`)
    eventsBus.publish(`mutation#${operation}`, { args, result })

    return result
  }
}

export default HookMiddleware
