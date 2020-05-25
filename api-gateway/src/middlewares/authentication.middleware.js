import { isEmpty, isFunction } from 'lodash'

const AuthenticationMiddleware = {
  async Query(resolve, root, args, context, info) {
    const query = info.schema.getQueryType().getFields()[info.fieldName]

    if (query.authenticate === true) {
      const { user } = await context.authenticate('jwt', { session: false })

      if (!isEmpty(user)) {
        context.user = user
      } else {
        throw new Error('Authentication required')
      }
    } else if (isFunction(query.authenticate)) {
      const user = await query.authenticate(root, args, context, info)

      context.user = user
    }

    return resolve(root, args, context, info)
  },
  async Mutation(resolve, root, args, context, info) {
    const mutation = info.schema.getMutationType().getFields()[info.fieldName]

    if (mutation.authenticate === true) {
      const { user } = await context.authenticate('jwt', { session: false })

      if (!isEmpty(user)) {
        context.user = user
      } else {
        throw new Error('Authentication required')
      }
    } else if (isFunction(mutation.authenticate)) {
      const user = await mutation.authenticate(root, args, context, info)

      context.user = user
    }

    return resolve(root, args, context, info)
  }
}

export default AuthenticationMiddleware
