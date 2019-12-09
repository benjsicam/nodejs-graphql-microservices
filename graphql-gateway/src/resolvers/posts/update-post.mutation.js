import * as yup from 'yup'

import { isString, isBoolean } from 'lodash'

import errorUtils from '../../utils/error'
import authUtils from '../../utils/auth'

const updatePost = {
  validationSchema: yup.object().shape({
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
  resolve: async (parent, args, { request, postService, logger, pubsub }) => {
    const { id, data } = args

    const author = await authUtils.getUser(request)
    const post = await postService.findOne({ where: { id, author } })
    const originalPost = { ...post }

    logger.info('PostMutation#updatePost.target', post)

    if (!post) {
      return errorUtils.buildError(['Post not found or you may not be the owner of the post'])
    }

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

    if (originalPost.published && !post.published) {
      logger.info('PostMutation#updatePost.event', 'DELETED')

      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: originalPost
        }
      })
    } else if (!originalPost.published && post.published) {
      logger.info('PostMutation#updatePost.event', 'CREATED')

      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: updatedPost
        }
      })
    } else if (post.published) {
      logger.info('PostMutation#updatePost.event', 'UPDATED')

      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: updatedPost
        }
      })
    }

    return { post: updatedPost }
  }
}

export default { updatePost }
