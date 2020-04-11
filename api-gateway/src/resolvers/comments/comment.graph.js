const CommentGraph = {
  author: {
    resolve: async (parent, args, { userService }) => userService.loader.load(parent.author)
  },
  post: {
    resolve: async (parent, args, { postService }) => postService.loader.load(parent.post)
  }
}

export default CommentGraph
