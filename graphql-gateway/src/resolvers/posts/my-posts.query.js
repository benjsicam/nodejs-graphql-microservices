import authUtils from '../../utils/auth'

const myPosts = {
  beforeResolve: async (parent, args, {request}) => {
    const author = await authUtils.getUser(request)

    let query = { where: { author } }

    if (args.query) query = { where: { author, title: { $like: args.query } } }

    return { query }
  },
  resolve: async (parent, { query }, { postService }) => {
    return postService.findAll(query)
  }
}

export default { myPosts }
