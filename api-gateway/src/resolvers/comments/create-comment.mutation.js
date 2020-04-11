import * as yup from 'yup'

const createComment = {
  authenticate: true,
  validationSchema: yup.object().shape({
    data: yup.object().shape({
      text: yup.string().trim().required('Text is a required field.').min(5, 'Text should at least be 5 characters.')
        .max(500, 'Text should be 500 characters at most.'),
      post: yup.string().required('Post is a required field.')
    })
  }),
  resolve: async (parent, { data, user }, {
    userService, postService, commentService, logger
  }) => {
    const userExists = (await userService.count({ where: { id: user } })) >= 1
    const postExists = (await postService.count({ where: { id: data.post, published: true } })) >= 1

    logger.info('CommentMutation#createComment.check', !userExists, !postExists)

    if (!userExists || !postExists) {
      throw new Error('Unable to find user or post')
    }

    const comment = await commentService.create({
      ...data,
      author: user
    })

    return {
      comment
    }
  }
}

export default { createComment }
