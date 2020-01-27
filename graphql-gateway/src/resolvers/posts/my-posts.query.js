const myPosts = {
  authRequired: true,
  beforeResolve: async (parent, args, { request }) => {
    let query = { where: { author: args.user } }

    if (args.query) query = { where: { author: args.user, title: { $like: args.query } } }

    return { query }
  },
  resolve: async (parent, { query }, { postService }) => {
    return postService.findAll(query)
  }
}

export default { myPosts }
