const commentCount = {
  authenticate: false,
  resolve: async (parent, { q }, { commentService }) => {
    let query = {}

    if (q) query = { where: { text: { $like: q } } }

    return commentService.count(query)
  }
}

export default { commentCount }
