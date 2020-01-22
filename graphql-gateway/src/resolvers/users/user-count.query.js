const userCount = {
  authRequired: false,
  beforeResolve: async (parent, args) => {
    let query = {}

    if (args.query) query = { where: { name: { $like: args.query } } }

    return { query }
  },
  resolve: async (parent, { query }, { userService }) => {
    return userService.count(query)
  }
}

export default { userCount }
