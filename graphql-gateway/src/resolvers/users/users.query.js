const users = {
  authenticate: true,
  beforeResolve: async (parent, args) => {
    let query = {}

    if (args.q) query = { where: { name: { $like: args.q } } }

    return { query }
  },
  resolve: async (parent, { query }, { userService }) => {
    return userService.findAll(query)
  }
}

export default { users }
