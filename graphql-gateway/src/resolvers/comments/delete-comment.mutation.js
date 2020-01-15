import * as yup from 'yup'

import authUtils from '../../utils/auth'

const deleteComment = {
  validationSchema: yup.object().shape({
    id: yup.string().required('ID is a required field.')
  }),
  beforeResolve: async (args, { request, commentService, logger }) => {
    const author = await authUtils.getUser(request)
    const comment = await commentService.findOne({ where: { id: args.id, author } })

    logger.info('CommentMutation#deleteComment.check', !comment)

    if (!comment) {
      throw new Error('Comment not found or you may not be the owner of the comment')
    }

    return {
      id: args.id,
      comment
    }
  },
  resolve: async (parent, { id, comment }, { commentService }) => {
    const count = await commentService.destroy(id)

    return { comment, count }
  },
  afterResolve: async ({ comment, count }, { pubsub }) => {
    pubsub.publish(`comment#${comment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: comment
      }
    })

    return { count }
  }
}

export default { deleteComment }
