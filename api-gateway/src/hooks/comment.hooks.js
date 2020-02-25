class CommentHooks {
  constructor(services, pubsub, logger) {
    this._eventBus = services.eventsBus
    this._pubsub = pubsub
    this._logger = logger

    this._eventsBus.on('mutation#createComment', this.onCreate())
    this._eventsBus.on('mutation#updateComment', this.onUpdate())
    this._eventsBus.on('mutation#deleteComment', this.onDelete())
  }

  onCreate() {
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

      this._pubsub.publish('comment', {
        mutation: 'CREATED',
        data: result
      })

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

  onUpdate() {
    return async ({ result }) => {
      this._logger.info('CommentHooks#onCreate.call', result)

      this._pubsub.publish('comment', {
        mutation: 'UPDATED',
        data: result
      })
    }
  }

  onDelete() {
    return async ({ args, result }) => {
      this._logger.info('CommentHooks#onDelete.call', result)

      if (result >= 1) {
        this._pubsub.publish('comment', {
          mutation: 'DELETED',
          data: {
            id: args.id
          }
        })
      }
    }
  }
}

export default CommentHooks
