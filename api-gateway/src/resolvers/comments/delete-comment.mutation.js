import * as yup from 'yup'

const deleteComment = {
  authenticate: true,
  authorize: async (parent, { id }, { user, commentsService }) => {
    const count = await commentsService.count({ where: { id, author: user.id } })

    if (count <= 0) {
      throw new Error('You are not allowed to delete this comment.')
    }
  },
  validationSchema: yup.object().shape({
    id: yup.string().required('ID is a required field.')
  }),
  resolve: async (parent, { id }, { commentsService }) => {
    const count = await commentsService.destroy({
      where: { id }
    })

    return { count }
  }
}

export default { deleteComment }
