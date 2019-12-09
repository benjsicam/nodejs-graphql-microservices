import { isFunction } from 'lodash'

const HookMiddleware = {
  async Query(resolve, root, args, context, info) {
    const { logger, eventsBus } = context
    const operation = info.fieldName
    const query = info.schema.getQueryType().getFields()[operation]

    let result = args

    if (isFunction(query.beforeResolve)) {
      logger.info(`Exec beforeResolve on query#${operation}`)
      result = await query.beforeResolve(root, args, context, info)
    }

    result = await resolve(root, result, context, info)

    if (isFunction(query.afterResolve)) {
      logger.info(`Exec afterResolve on query#${operation}`)
      result = await query.afterResolve(result, context, info)
    }

    logger.info(`Publish event on query#${operation}`)
    eventsBus.publish(`query#${operation}`, result)

    return result
  },
  async Mutation(resolve, root, args, context, info) {
    const { logger, eventsBus } = context
    const operation = info.fieldName
    const mutation = info.schema.getMutationType().getFields()[operation]

    let result = args

    if (isFunction(mutation.beforeResolve)) {
      logger.info(`Exec beforeResolve on mutation#${operation}`)
      result = await mutation.beforeResolve(args, context, info)
    }

    result = await resolve(root, result, context, info)

    if (isFunction(mutation.afterResolve)) {
      logger.info(`Exec afterResolve on mutation#${operation}`)
      result = await mutation.afterResolve(result, context, info)
    }

    logger.info(`Publish event on mutation#${operation}`)
    eventsBus.publish(`mutation#${operation}`, result)

    return result
  }
}

export default HookMiddleware
