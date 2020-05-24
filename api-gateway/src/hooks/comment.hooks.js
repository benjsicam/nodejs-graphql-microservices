class CommentHooks {
  constructor(services, logger) {
    this._eventsBus = services.eventsBus
    this._services = services
    this._logger = logger

    this._eventsBus.on('mutation#createComment', this.onCreate())
  }

  onCreate() {
    return async ({ result }) => {
      this._logger.info('CommentHooks#onCreate.call %o', result.comment)

      const { comment } = result

      const { mailerService, postsService, usersService } = this._services

      const post = await postsService.findOne({
        where: { id: comment.post }
      })

      const postAuthor = await usersService.findOne({
        where: { id: post.author }
      })

      const commentAuthor = await usersService.findOne({
        where: { id: comment.author }
      })

      return mailerService.send({
        template: 'new-comment',
        to: postAuthor.email,
        data: Buffer.from(
          JSON.stringify({
            comment,
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
