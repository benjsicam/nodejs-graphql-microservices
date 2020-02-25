import { isFunction } from 'lodash'

const AuthorizationMiddleware = {
  async Query(resolve, root, args, context, info) {
    const query = info.schema.getQueryType().getFields()[info.fieldName]

    if (isFunction(query.authorize)) {
      await query.authorize(root, args, context, info)
    }

    return resolve(root, args, context, info)
  },
  async Mutation(resolve, root, args, context, info) {
    const mutation = info.schema.getMutationType().getFields()[info.fieldName]

    if (isFunction(mutation.authorize)) {
      await mutation.authorize(root, args, context, info)
    }

    return resolve(root, args, context, info)
  },
  async Subscription(resolve, root, args, context, info) {
    const subscription = info.schema.getSubscriptionType().getFields()[info.fieldName]

    if (isFunction(subscription.authorize)) {
      await subscription.authorize(root, args, context, info)
    }

    return resolve(root, args, context, info)
  }
}

export default AuthorizationMiddleware
