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
      comment
    }
  },
  resolve: async (parent, { comment }, { commentService }) => {
    const count = await commentService.destroy(comment.id)

    return { count }
  }
}

export default { deleteComment }
