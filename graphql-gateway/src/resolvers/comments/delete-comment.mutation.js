import * as yup from 'yup'

import errorUtils from '../../utils/error'
import authUtils from '../../utils/auth'

const deleteComment = {
  validationSchema: yup.object().shape({
    id: yup.string().required('ID is a required field.')
  }),
  resolve: async (parent, { id }, { request, commentService, logger, pubsub }) => {
    const author = await authUtils.getUser(request)
    const comment = await commentService.findOne({ where: { id, author } })

    logger.info('CommentMutation#deleteComment.check', !comment)

    if (!comment) {
      return errorUtils.buildError(['Comment not found or you may not be the owner of the comment'])
    }

    const count = await commentService.destroy(id)

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
