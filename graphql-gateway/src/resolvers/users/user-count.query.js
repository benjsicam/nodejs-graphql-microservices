const userCount = {
  authenticate: false,
  beforeResolve: async (parent, args) => {
    let query = {}

    if (args.q) query = { where: { name: { $like: args.q } } }

    return { query }
  },
  resolve: async (parent, { query }, { userService }) => {
    return userService.count(query)
  }
}

export default { userCount }
