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

      // return comment
      const { mailerService, postService, userService } = this._services

      const post = await postService.findOne({
        where: { id: comment.post }
      })

      const postAuthor = await userService.findOne({
        where: { id: post.author }
      })

      const commentAuthor = await userService.findOne({
        where: { id: comment.comment.author }
      })

      pubsub.publish(`comment#${comment.post}`, {
        comment: {
          mutation: 'CREATED',
          data: comment
        }
      })

      return mailerService.send({
        template: 'new-comment',
        to: postAuthor.email,
        data: Buffer.from(JSON.stringify({
          comment: comment.comment,
          post,
          postAuthor,
          commentAuthor
        }))
      })
    }
  }

  onUpdate() {
    return async comment => {
      pubsub.publish(`comment#${comment.post}`, {
        comment: {
          mutation: 'UPDATED',
          data: comment
        }
      })

      return
    }
  }
}

export default CommentHooks
