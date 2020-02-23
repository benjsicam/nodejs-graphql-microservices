const postCount = {
  authenticate: false,
  beforeResolve: async (parent, args) => {
    let query = {}

    if (args.q) query = { where: { title: { $like: args.q } } }

    return { query }
  },
  resolve: async (parent, { query }, { postService }) => {
    return postService.count(query)
  }
}

export default { postCount }
