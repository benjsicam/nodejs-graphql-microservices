const deleteAccount = {
  authenticate: true,
  resolve: async (parent, args, { userService, logger }) => {
    const user = await userService.findOne({ where: { id: args.user } })

    logger.info('UserMutation#deleteAccount.check1', !user)

    if (!user) {
      throw new Error('User not found')
    }

    const count = await userService.destroy(user.id)

    return { count }
  }
}

export default { deleteAccount }
