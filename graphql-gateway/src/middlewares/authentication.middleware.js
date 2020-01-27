import authUtils from '../utils/auth'

const AuthenticationMiddleware = {
  async Mutation(resolve, root, args, context, info) {
    const mutation = info.schema.getMutationType().getFields()[info.fieldName]

    if (mutation.authRequired === true) {
      const author = await authUtils.getUser(context.request)

      Object.assign(args, { user: author })
    }

    return resolve(root, args, context, info)
  },
  async Query(resolve, root, args, context, info) {
    const query = info.schema.getQueryType().getFields()[info.fieldName]

    if (query.authRequired === true) {
      const author = await authUtils.getUser(context.request)

      Object.assign(args, { user: author })
    }

    return resolve(root, args, context, info)
  }
}

export default AuthenticationMiddleware
