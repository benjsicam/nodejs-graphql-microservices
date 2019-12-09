const commentCount = {
  resolve: async (parent, args, { commentService }) => {
    let query = {}

    if (args.query) query = { where: { text: { $like: args.query } } }

    return commentService.count(query)
  }
}

export default { commentCount }
