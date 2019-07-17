const CommentSubscription = {
  comment: {
    async subscribe(parent, { post }, { postService, logger, pubsub }, info) {
      logger.info('CommentSubscription#subscribe.call', post)

      const postExists = (await postService.count({ where: { id: post, published: true } })) >= 1

      if (!postExists) {
        throw new Error('Unable to fiind post')
      }

      return pubsub.asyncIterator(`comment#${post}`)
    }
  }
}

export default CommentSubscription
