import * as yup from 'yup'

const deleteComment = {
  authenticate: true,
  authorize: async ({ id, user }, { commentService }) => {
    const count = await commentService.count({ where: { id, author: user } })

    if (count <= 0) {
      throw new Error('You are not allowed to delete this comment.')
    }
  },
  validationSchema: yup.object().shape({
    id: yup.string().required('ID is a required field.')
  }),
  resolve: async (parent, { comment }, { commentService }) => {
    const count = await commentService.destroy(comment.id)

    return { count }
  }
}

export default { deleteComment }
