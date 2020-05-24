const me = {
  authenticate: true,
  resolve: async (parent, args, { user, usersService }) => usersService.findById(user.id)
}

export default { me }
