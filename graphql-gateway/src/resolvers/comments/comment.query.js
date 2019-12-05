const CommentQuery = {
  comments: {
    resolve: async (parent, args, { commentService, logger }) => {
      logger.info('CommentQuery#comments.call', args)
  
      let query = {}
  
      if (args.query) query = { where: { text: { $like: args.query } } }
  
      const comments = await commentService.findAll(query)
  
      logger.info('CommentQuery#comments.result', comments)
  
      return comments
    }
  },
  commentCount: {
    resolve: async (parent, args, { commentService, logger }) => {
      logger.info('CommentQuery#commentCount.call', args)
  
      let query = {}
  
      if (args.query) query = { where: { text: { $like: args.query } } }
  
      const count = await commentService.count(query)
  
      logger.info('CommentQuery#commentCount.result', count)
  
      return count
    }
  }
}

export default CommentQuery
