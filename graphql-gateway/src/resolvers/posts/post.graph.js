const PostGraph = {
  async author(parent, args, { userService, logger }) {
    logger.info('PostGraph#author.call', parent.author)

    const user = await userService.findOne({
      where: {
        id: parent.author
      }
    })

    logger.info('PostGraph#author.result', user)

    return user
  },
  async comments(parent, args, { commentService, logger }) {
    logger.info('PostGraph#comments.call', parent.id)

    const comments = await commentService.findAll({
      where: {
        post: parent.id
      }
    })

    logger.info('PostGraph#comments.result', comments)

    return comments
  }
}

export { PostGraph as default }
