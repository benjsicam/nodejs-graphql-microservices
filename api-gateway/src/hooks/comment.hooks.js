class CommentHooks {
  constructor (services, pubsub, logger) {
    this._eventsBus = services.eventsBus
    this._services = services
    this._pubsub = pubsub
    this._logger = logger

    this._eventsBus.on('mutation#createComment', this.onCreate())
  }

  onCreate () {
    return async ({ result }) => {
      this._logger.info('CommentHooks#onCreate.call', result)

      const { mailerService, postService, userService } = this._services

      const post = await postService.findOne({
        where: { id: result.post }
      })

      const postAuthor = await userService.findOne({
        where: { id: post.author }
      })

      const commentAuthor = await userService.findOne({
        where: { id: result.author }
      })

      this._pubsub.publish('commentAdded', result)

      return mailerService.send({
        template: 'new-comment',
        to: postAuthor.email,
        data: Buffer.from(
          JSON.stringify({
            comment: result,
            post,
            postAuthor,
            commentAuthor
          })
        )
      })
    }
  }
}

export default CommentHooks
