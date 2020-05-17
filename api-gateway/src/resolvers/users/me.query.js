const me = {
  authenticate: true,
  resolve: async (parent, args, { user, userService }) => userService.findById(user.id)
}

export default { me }
