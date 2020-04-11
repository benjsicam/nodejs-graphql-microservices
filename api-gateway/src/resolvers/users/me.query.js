const me = {
  authenticate: true,
  resolve: async (parent, { user }, { userService }) => userService.findById(user)
}

export default { me }
