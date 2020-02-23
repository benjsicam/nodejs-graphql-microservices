const myPosts = {
  authenticate: true,
  beforeResolve: async (parent, args, { request }) => {
    let query = { where: { author: args.user } }

    if (args.q) query = { where: { author: args.user, title: { $like: args.q } } }

    return { query }
  },
  resolve: async (parent, { query }, { postService }) => {
    return postService.findAll(query)
  }
}

export default { myPosts }
