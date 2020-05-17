import * as yup from 'yup'

import { isString, isBoolean } from 'lodash'

const updatePost = {
  authenticate: true,
  authorize: async (parent, { id }, { user, postService }) => {
    const count = await postService.count({ where: { id, author: user.id } })

    if (count <= 0) {
      throw new Error('You are not allowed to update this post.')
    }
  },
  validationSchema: yup.object().shape({
    id: yup
      .string()
      .required('ID is a required field.'),
    data: yup.object().shape({
      title: yup
        .string()
        .trim()
        .min(5, 'Title should at least be 5 characters.')
        .max(100, 'Title should be 100 characters at most.'),
      body: yup
        .string()
        .trim()
        .min(5, 'Body should at least be 5 characters.'),
      published: yup.boolean()
    })
  }),
  resolve: async (parent, { id, data }, { user, postService, logger }) => {
    const post = await postService.findOne({ where: { id, author: user.id } })

    logger.info('PostMutation#updatePost.target', post)

    if (isString(data.title)) {
      post.title = data.title
    }

    if (isString(data.body)) {
      post.body = data.body
    }

    if (isBoolean(data.published)) {
      post.published = data.published
    }

    const updatedPost = await postService.update(id, post)

    return { post: updatedPost }
  }
}

export default { updatePost }
