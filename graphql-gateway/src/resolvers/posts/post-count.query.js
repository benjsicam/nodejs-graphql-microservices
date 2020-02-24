const postCount = {
  authenticate: false,
  resolve: async (parent, { q }, { postService }) => {
    let query = {}

    if (q) query = { where: { title: { $like: q } } }

    return postService.count(query)
  }
}

export default { postCount }
