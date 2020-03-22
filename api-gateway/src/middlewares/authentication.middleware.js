import { isFunction } from 'lodash'

import authUtils from '../utils/auth'

const AuthenticationMiddleware = {
  async Query(resolve, root, args, context, info) {
    const query = info.schema.getQueryType().getFields()[info.fieldName]

    if (query.authenticate === true) {
      const user = await authUtils.getUser(context.request)

      Object.assign(args, { user })
    } else if (isFunction(query.authenticate)) {
      const user = await query.authenticate(root, args, context, info)

      Object.assign(args, { user })
    }

    return resolve(root, args, context, info)
  },
  async Mutation(resolve, root, args, context, info) {
    const mutation = info.schema.getMutationType().getFields()[info.fieldName]

    if (mutation.authenticate === true) {
      const user = await authUtils.getUser(context.request)

      Object.assign(args, { user })
    } else if (isFunction(mutation.authenticate)) {
      const user = await mutation.authenticate(root, args, context, info)

      Object.assign(args, { user })
    }

    return resolve(root, args, context, info)
  },
  async Subscription(resolve, root, args, context, info) {
    const subscription = info.schema.getSubscriptionType().getFields()[info.fieldName]

    if (subscription.authenticate === true) {
      const user = await authUtils.getUser(context.request)

      Object.assign(args, { user })
    } else if (isFunction(subscription.authenticate)) {
      const user = await subscription.authenticate(root, args, context, info)

      Object.assign(args, { user })
    }

    return resolve(root, args, context, info)
  },
}

export default AuthenticationMiddleware
