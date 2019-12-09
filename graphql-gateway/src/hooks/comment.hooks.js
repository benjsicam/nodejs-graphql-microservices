class CommentHooks {
  constructor(eventsBus, services, logger) {
    this._services = services
    this._logger = logger

    eventsBus.on('mutation#createComment', this.onCreate())
  }

  onCreate() {
    return async comment => {
      const logger = this._logger

      logger.info(comment)

      return comment

      // const { mailer, postService, userService } = this._services

      // const post = await postService.findOne({
      //   where: { id: comment.post }
      // })

      // const author = await userService.findOne({
      //   where: { id: post.author }
      // })

      // return mailer.send({
      //   template: 'new-comment',
      //   to: author.email,
      //   data: comment
      // })
    }
  }
}

export default CommentHooks
