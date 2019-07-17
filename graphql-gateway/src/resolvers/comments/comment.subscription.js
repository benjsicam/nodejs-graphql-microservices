const CommentSubscription = {
  comment: {
    async subscribe(parent, { post }, { postService, pubsub }, info) {
      const postExists =
        (await postService.count({
          query: { where: { id: post, published: true } }
        })) >= 1

      if (!postExists) {
        throw new Error('Unable to fiind post')
      }

      return pubsub.asyncIterator(`comment#${post}`)
    }
  }
}

export default CommentSubscription
