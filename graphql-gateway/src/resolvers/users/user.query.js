const user = {
  resolve: async (parent, { id }, { userService }) => {
    return userService.findOne({ where: { id } })
  }
}

export default { user }
