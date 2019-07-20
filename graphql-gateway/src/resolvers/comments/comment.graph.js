const CommentGraph = {
  async author(parent, args, { userService, logger }) {
    logger.info('CommentGraph#author.call', parent.author)

    const user = await userService.findOne({
      where: {
        id: parent.author
      }
    })

    logger.info('CommentGraph#author.result', user)

    return user
  },
  async post(parent, args, { postService, logger }) {
    logger.info('CommentGraph#post.call', parent.author)

    const post = await postService.findOne({
      where: {
        id: parent.post
      }
    })

    logger.info('CommentGraph#post.result', post)

    return post
  }
}

export { CommentGraph as default }
