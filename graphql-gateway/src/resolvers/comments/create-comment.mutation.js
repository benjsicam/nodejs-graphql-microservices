import * as yup from 'yup'

import errorUtils from '../../utils/error'
import authUtils from '../../utils/auth'

const createComment = {
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
  resolve: async (parent, { data }, { request, commentService, postService, userService, logger, pubsub }) => {
    const author = await authUtils.getUser(request)

    const userExists = (await userService.count({ where: { id: author } })) >= 1
    const postExists = (await postService.count({ where: { id: data.post, published: true } })) >= 1

    logger.info('CommentMutation#createComment.check', !userExists, !postExists)

    if (!userExists || !postExists) {
      return errorUtils.buildError(['Unable to find user and post'])
    }

    const comment = await commentService.create({
      ...data,
      author
    })

    pubsub.publish(`comment#${data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment
      }
    })

    return { comment }
  }
}

export default { createComment }
