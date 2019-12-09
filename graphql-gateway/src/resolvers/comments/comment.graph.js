const CommentGraph = {
  author: {
    resolve: async (parent, args, { userService }) => {
      return userService.loader.load(parent.author)
    }
  },
  post: {
    resolve: async (parent, args, { postService }) => {
      return postService.loader.load(parent.post)
    }
  }
}

export default CommentGraph
