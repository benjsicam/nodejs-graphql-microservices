const CommentGraph = {
  author: {
    resolve: async (parent, args, { userService, logger }) => {
      logger.info('CommentGraph#author.call', parent.author)
  
      const user = await userService.loader.load(parent.author)
  
      logger.info('CommentGraph#author.result', user)
  
      return user
    }
  },
  post: {
    resolve: async (parent, args, { postService, logger }) => {
      logger.info('CommentGraph#post.call', parent.author)
  
      const post = await postService.loader.load(parent.post)
  
      logger.info('CommentGraph#post.result', post)
  
      return post
    }
  }
}

export { CommentGraph as default }
