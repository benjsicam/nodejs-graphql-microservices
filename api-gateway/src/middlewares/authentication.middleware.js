import { get, isEmpty, isFunction } from 'lodash'

const AuthenticationMiddleware = {
  async Query(resolve, root, args, context, info) {
    const query = info.schema.getQueryType().getFields()[info.fieldName]
    const user = get(context, 'user')

    if (isEmpty(user) && query.authenticate === true) {
      throw new Error('Authentication required')
    } else if (isFunction(query.authenticate)) {
      await query.authenticate(root, args, context, info)
    }

    return resolve(root, args, context, info)
  },
  async Mutation(resolve, root, args, context, info) {
    const mutation = info.schema.getMutationType().getFields()[info.fieldName]
    const user = get(context, 'user')

    if (isEmpty(user) && mutation.authenticate === true) {
      throw new Error('Authentication required')
    } else if (isFunction(mutation.authenticate)) {
      await mutation.authenticate(root, args, context, info)
    }

    return resolve(root, args, context, info)
  }
}

export default AuthenticationMiddleware
