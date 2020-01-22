import * as yup from 'yup'

const deleteComment = {
  authRequired: true,
  validationSchema: yup.object().shape({
    id: yup.string().required('ID is a required field.')
  }),
  beforeResolve: async (args, { commentService, logger }) => {
    const comment = await commentService.findOne({ where: { id: args.id, author: args.user } })

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
