const user = {
  authRequired: true,
  resolve: async (parent, { id }, { userService }) => {
    return userService.findOne({ where: { id } })
  }
}

export default { user }
