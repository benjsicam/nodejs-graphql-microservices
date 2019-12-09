const comments = {
  resolve: async (parent, args, { commentService }) => {
    let query = {}

    if (args.query) query = { where: { text: { $like: args.query } } }

    return commentService.findAll(query)
  }
}

export default { comments }
