import * as yup from 'yup'

const deletePost = {
  authenticate: true,
  authorize: async (parent, { id }, { user, postService }) => {
    const count = await postService.count({ where: { id, author: user.id } })

    if (count <= 0) {
      throw new Error('You are not allowed to delete this post.')
    }
  },
  validationSchema: yup.object().shape({
    id: yup
      .string()
      .required('ID is a required field.')
  }),
  resolve: async (parent, { id }, { postService }) => {
    const count = await postService.destroy({
      where: { id }
    })

    return { count }
  }
}

export default { deletePost }
