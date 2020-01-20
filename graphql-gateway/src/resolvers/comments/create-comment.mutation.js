import * as yup from 'yup'

import authUtils from '../../utils/auth'

const createComment = {
  authRequired: true,
  validationSchema: yup.object().shape({
    data: yup.object().shape({
      text: yup
        .string()
        .trim()
        .required('Text is a required field.')
        .min(5, 'Text should at least be 5 characters.')
        .max(500, 'Text should be 500 characters at most.'),
      post: yup.string().required('Post is a required field.')
    })
  }),
  beforeResolve: async (args, { request, postService, userService, logger }) => {
    const author = await authUtils.getUser(request)

    const userExists = (await userService.count({ where: { id: author } })) >= 1
    const postExists = (await postService.count({ where: { id: args.data.post, published: true } })) >= 1

    logger.info('CommentMutation#createComment.check', !userExists, !postExists)

    if (!userExists || !postExists) {
      throw new Error('Unable to find user and post')
    }

    return {
      data: {
        ...args.data,
      },
      author
    }
  },
  resolve: async (parent, { data, author }, { commentService, logger }) => {
    const comment = await commentService.create({
      ...data,
      author
    })

    return {
      comment
     }
  }
}

export default { createComment }
