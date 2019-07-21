const CommentQuery = {
  async comments(parent, args, { commentService, logger }) {
    logger.info('CommentQuery#comments.call', args)

    let query = {}

    if (args.query) query = { where: { text: { $like: args.query } } }

    const comments = await commentService.findAll(query)

    logger.info('CommentQuery#comments.result', comments)

    return comments
  }
}

export default CommentQuery
