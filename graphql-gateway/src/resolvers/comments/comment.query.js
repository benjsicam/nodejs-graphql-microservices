const CommentQuery = {
  async comments(parent, args, { commentService, logger }, info) {
    logger.info('CommentQuery#comments.call')

    const comments = await commentService.findAll()

    logger.info('CommentQuery#comments.result', comments)

    return comments
  }
}

export default CommentQuery
