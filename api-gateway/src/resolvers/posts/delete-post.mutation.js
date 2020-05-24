import * as yup from 'yup'

const deletePost = {
  authenticate: true,
  authorize: async (parent, { id }, { user, postsService }) => {
    const count = await postsService.count({ where: { id, author: user.id } })

    if (count <= 0) {
      throw new Error('You are not allowed to delete this post.')
    }
  },
  validationSchema: yup.object().shape({
    id: yup.string().required('ID is a required field.')
  }),
  resolve: async (parent, { id }, { postsService }) => {
    const count = await postsService.destroy({
      where: { id }
    })

    return { count }
  }
}

export default { deletePost }
