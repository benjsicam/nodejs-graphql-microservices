const posts = {
  authenticate: false,
  resolve: async (parent, { q }, { postService }) => {
    let query = {}

    if (q) query = { where: { title: { $like: q } } }

    return postService.findAll(query)
  }
}

export default { posts }
