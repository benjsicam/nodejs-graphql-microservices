const user = {
  authenticate: true,
  resolve: async (parent, { id }, { userService }) => {
    return userService.findById(id)
  }
}

export default { user }
