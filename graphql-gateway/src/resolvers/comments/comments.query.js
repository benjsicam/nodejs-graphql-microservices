const comments = {
  authenticate: false,
  resolve: async (parent, { q }, { commentService }) => {
    let query = {}

    if (q) query = { where: { text: { $like: q } } }

    return commentService.findAll(query)
  }
}

export default { comments }
