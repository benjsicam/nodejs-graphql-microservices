const CommentGraph = {
  author: {
    resolve: async (parent, args, { usersService }) => usersService.loader.load(parent.author)
  },
  post: {
    resolve: async (parent, args, { postsService }) => postsService.loader.load(parent.post)
  }
}

export default CommentGraph
