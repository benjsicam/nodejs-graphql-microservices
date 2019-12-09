import authUtils from '../../utils/auth'

const myPosts = {
  resolve: async (parent, args, { request, postService }) => {
    const author = await authUtils.getUser(request)

    let query = { where: { author } }

    if (args.query) query = { where: { author, title: { $like: args.query } } }

    return postService.findAll(query)
  }
}

export default { myPosts }
