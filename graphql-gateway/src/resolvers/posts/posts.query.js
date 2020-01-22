const posts = {
  authRequired: false,
  beforeResolve: async (parent, args) => {
    let query = {}

    if (args.query) query = { where: { title: { $like: args.query } } }

    return { query }
  },
  resolve: async (parent, { query }, { postService }) => {
    return postService.findAll(query)
  }
}

export default { posts }
