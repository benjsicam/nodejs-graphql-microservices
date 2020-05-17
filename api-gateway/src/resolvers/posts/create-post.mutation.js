import * as yup from 'yup'

const createPost = {
  authenticate: true,
  validationSchema: yup.object().shape({
    data: yup.object().shape({
      title: yup
        .string()
        .trim()
        .required('Title is a required field.')
        .min(5, 'Title should at least be 5 characters.')
        .max(100, 'Title should be 100 characters at most.'),
      body: yup
        .string()
        .trim()
        .required('Body is a required field.')
        .min(5, 'Body should at least be 5 characters.'),
      published: yup.boolean()
    })
  }),
  resolve: async (parent, { data }, { user, postService }) => {
    const post = await postService.create({
      ...data,
      author: user.id
    })

    return { post }
  }
}

export default { createPost }
