const PostSubscription = {
  post: {
    async subscribe(parent, args, { pubsub }, info) {
      return pubsub.asyncIterator('post')
    }
  }
}

export default PostSubscription
