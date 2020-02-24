const me = {
  authenticate: true,
  resolve: async (parent, { user }, { userService }) => {
    return userService.findOne({ where: { id: user } })
  }
}

export default { me }
