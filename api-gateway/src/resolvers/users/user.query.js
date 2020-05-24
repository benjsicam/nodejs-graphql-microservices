const user = {
  authenticate: true,
  resolve: async (parent, { id }, { usersService }) => usersService.findById(id)
}

export default { user }
