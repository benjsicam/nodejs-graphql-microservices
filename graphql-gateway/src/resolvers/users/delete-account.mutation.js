import authUtils from '../../utils/auth'
import errorUtils from '../../utils/error'

const deleteAccount = {
  resolve: async (parent, args, { request, commentService, postService, userService, logger }) => {
    const id = await authUtils.getUser(request)
    const user = await userService.findOne({ where: { id } })

    logger.info('UserMutation#deleteAccount.check1', !user)

    if (!user) {
      return errorUtils.buildError(['User not found'])
    }

    const postExists = (await postService.count({ where: { author: id } })) >= 1
    const commentExists = (await commentService.count({ where: { author: id } })) >= 1

    logger.info('UserMutation#deleteAccount.check1', postExists || commentExists)

    if (postExists || commentExists) {
      return errorUtils.buildError(['You have already made posts and comments. Kindly delete those first.'])
    }

    const count = await userService.destroy(id)

    return { count }
  }
}

export default { deleteAccount }
