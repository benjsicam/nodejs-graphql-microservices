import errorUtils from '../utils/error'

const ErrorMiddleware = {
  async Mutation(resolve, root, args, context, info) {
    try {
      return await resolve(root, args, context, info)
    } catch (error) {
      return errorUtils.buildError(error)
    }
  },
  async Query(resolve, root, args, context, info) {
    try {
      return await resolve(root, args, context, info)
    } catch (error) {
      return errorUtils.buildError(error)
    }
  }
}

export default ErrorMiddleware
