const posts = {
  resolve: async (parent, args, { postService }) => {
    let query = {}

    if (args.query) query = { where: { title: { $like: args.query } } }

    return postService.findAll(query)
  }
}

export default { posts }
