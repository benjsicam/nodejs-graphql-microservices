const users = {
  authenticate: true,
  resolve: async (parent, { q }, { userService }) => {
    let query = {}

    if (q) query = { where: { name: { $like: q } } }

    return userService.findAll(query)
  }
}

export default { users }
