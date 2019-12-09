import * as yup from 'yup'

import errorUtils from '../../utils/error'
import authUtils from '../../utils/auth'

const deletePost = {
  validationSchema: yup.object().shape({
    id: yup.string().required('ID is a required field.')
  }),
  resolve: async (parent, { id }, { request, postService, commentService, logger, pubsub }) => {
    const author = await authUtils.getUser(request)
    const post = await postService.findOne({ where: { id, author } })

    logger.info('PostMutation#deletePost.check', !post)

    if (!post) {
      return errorUtils.buildError(['Post not found or you may not be the owner of the post'])
    }

    const commentExists = (await commentService.count({ where: { post: id } })) >= 1

    if (commentExists) {
      return errorUtils.buildError(['Post not found or you may not be the owner of the post'])
    }

    const count = await postService.destroy(id)

    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: post
        }
      })
    }

    return { count }
  }
}

export default { deletePost }
