const deleteAccount = {
  authRequired: true,
  beforeResolve: async (args, { request, commentService, postService, userService, logger }) => {
    const user = await userService.findOne({ where: { id: args.user } })

    logger.info('UserMutation#deleteAccount.check1', !user)

    if (!user) {
      throw new Error('User not found')
    }

    const postExists = (await postService.count({ where: { author: args.user } })) >= 1
    const commentExists = (await commentService.count({ where: { author: args.user } })) >= 1

    logger.info('UserMutation#deleteAccount.check1', postExists || commentExists)

    if (postExists || commentExists) {
      throw new Error('You have already made posts and comments. Kindly delete those first.')
    }

    return { id: args.user }
  },
  resolve: async (parent, { id }, { userService }) => {
    const count = await userService.destroy(id)

    return { count }
  }
}

export default { deleteAccount }
