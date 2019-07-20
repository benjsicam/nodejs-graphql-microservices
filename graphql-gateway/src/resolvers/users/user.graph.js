const UserGraph = {
  async posts(parent, args, { postService, logger }) {
    logger.info('UserGraph#posts.call', parent.id)

    const posts = await postService.findAll({
      where: {
        author: parent.id
      }
    })

    logger.info('UserGraph#posts.result', posts)

    return posts
  },
  async comments(parent, args, { commentService, logger }) {
    logger.info('UserGraph#comments.call', parent.id)

    const comments = await commentService.findAll({
      where: {
        author: parent.id
      }
    })

    logger.info('UserGraph#comments.result', comments)

    return comments
  }
}

export default UserGraph
