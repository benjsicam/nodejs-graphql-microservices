const commentCount = {
  authRequired: false,
  beforeResolve: async (parent, args) => {
    let query = {}

    if (args.query) query = { where: { text: { $like: args.query } } }

    return {
      query
    }
  },
  resolve: async (parent, { query }, { commentService }) => {
    return commentService.count(query)
  }
}

export default { commentCount }
