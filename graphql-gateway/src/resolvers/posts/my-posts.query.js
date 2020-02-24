const myPosts = {
  authenticate: true,
  resolve: async (parent, { q, user }, { postService }) => {
    let query = { where: { author: user } }

    if (q) query = { where: { author: user, title: { $like: q } } }

    return postService.findAll(query)
  }
}

export default { myPosts }
