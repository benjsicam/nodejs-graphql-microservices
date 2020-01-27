import * as yup from 'yup'

const createPost = {
  authRequired: true,
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
  beforeResolve: async (args, { userService, logger }) => {
    const userExists = (await userService.count({ where: { id: args.user } })) >= 1

    logger.info('PostMutation#createPost.check', !userExists)

    if (!userExists) {
      throw new Error('User not found')
    }

    return {
      data: {
        ...args.data
      },
      author: args.user
    }
  },
  resolve: async (parent, { data, author }, { postService }) => {
    const post = await postService.create({
      ...data,
      author
    })

    return { data, post }
  },
  afterResolve: async ({ data, post }, { pubsub }) => {
    if (data.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: post
        }
      })
    }

    return { post }
  }
}

export default { createPost }
