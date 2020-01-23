const users = {
  authRequired: true,
  beforeResolve: async (parent, args) => {
    let query = {}

    if (args.query) query = { where: { name: { $like: args.query } } }

    return { query }
  },
  resolve: async (parent, { query }, { userService }) => {
    return userService.findAll(query)
  }
}

export default { users }
