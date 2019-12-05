import errorUtils from '../../utils/error'

const CommentSubscription = {
  comment: {
    subscribe: {
      resolve: async (parent, { post }, { postService, logger, pubsub }) => {
        logger.info('CommentSubscription#subscribe.call', post)
  
        const postExists = (await postService.count({ where: { id: post, published: true } })) >= 1
  
        if (!postExists) {
          return errorUtils.buildError(['Unable to find post'])
        }
  
        return pubsub.asyncIterator(`comment#${post}`)
      }
    }
  }
}

export default CommentSubscription
