const me = {
  authRequired: true,
  resolve: async (parent, args, { request, userService }) => {
    const user = await userService.findOne({ where: { id: args.user } })

    return user
  }
}

export default { me }
