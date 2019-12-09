const user = {
  resolve: async (parent, { id }, { userService, logger }) => {
    return userService.findOne({ where: { id } })
  }
}

export default { user }
