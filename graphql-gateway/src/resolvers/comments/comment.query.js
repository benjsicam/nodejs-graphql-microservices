const CommentQuery = {
  async comments(parent, args, { commentService }, info) {
    return commentService.findAll()
  }
}

export default CommentQuery
