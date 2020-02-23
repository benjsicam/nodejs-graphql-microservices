const comments = {
  authenticate: false,
  beforeResolve: async (parent, args) => {
    let query = {}

    if (args.q) query = { where: { text: { $like: args.q } } }

    return {
      query
    }
  },
  resolve: async (parent, { query }, { commentService }) => {
    return commentService.findAll(query)
  }
}

export default { comments }
