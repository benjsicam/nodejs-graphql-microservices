const user = {
  authenticate: true,
  resolve: async (parent, { id }, { userService }) => userService.findById(id)
}

export default { user }
