const me = {
  authenticate: true,
  resolve: async (parent, { user }, { userService }) => {
    return userService.findById(user)
  },
}

export default { me }
