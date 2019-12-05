const PostSubscription = {
  post: {
    subscribe: {
      resolve: async (parent, args, { pubsub, logger }) => {
        logger.info('PostSubscription#subscribe.call')
  
        return pubsub.asyncIterator('post')
      }
    }
  }
}

export default PostSubscription
