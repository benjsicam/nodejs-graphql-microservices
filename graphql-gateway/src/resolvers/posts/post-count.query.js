const postCount = {
  authRequired: false,
  beforeResolve: async (parent, args) => {
    let query = {}

    if (args.query) query = { where: { title: { $like: args.query } } }

    return { query }
  },
  resolve: async (parent, { query }, { postService }) => {
    return postService.count(query)
  }
}

export default { postCount }
