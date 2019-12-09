import errorUtils from '../../utils/error'

const comment = {
  subscribe: {
    resolve: async (parent, { post }, { postService, pubsub }) => {
      const postExists = (await postService.count({ where: { id: post, published: true } })) >= 1

      if (!postExists) {
        return errorUtils.buildError(['Unable to find post'])
      }

      return pubsub.asyncIterator(`comment#${post}`)
    }
  }
}

export default { comment }
