const postCount = {
  resolve: async (parent, args, { postService }) => {
    let query = {}

    if (args.query) query = { where: { title: { $like: args.query } } }

    return postService.count(query)
  }
}

export default { postCount }
