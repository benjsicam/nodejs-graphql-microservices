import * as yup from 'yup'

import { isString, isBoolean } from 'lodash'

import authUtils from '../../utils/auth'

const PostMutation = {
  createPost: {
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
    resolve: async (parent, { data }, { request, postService, userService, logger, pubsub }) => {
      logger.info('PostMutation#createPost.call', data)

      const author = await authUtils.getUser(request)
      const userExists = (await userService.count({ where: { id: author } })) >= 1

      logger.info('PostMutation#createPost.check', !userExists)

      if (!userExists) {
        throw new Error('User not found')
      }

      const post = await postService.create({
        ...data,
        author
      })

      if (data.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post
          }
        })
      }

      logger.info('PostMutation#createPost.result', post)

      return { post }
    }
  },
  updatePost: {
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

      logger.info('PostMutation#updatePost.call', id, data)

      const author = await authUtils.getUser(request)
      const post = await postService.findOne({ where: { id, author } })
      const originalPost = { ...post }

      logger.info('PostMutation#updatePost.target', post)

      if (!post) {
        throw new Error('Post not found or you may not be the owner of the post')
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

      logger.info('PostMutation#updatePost.result', updatedPost)

      return { post: updatedPost }
    }
  },
  deletePost: {
    validationSchema: yup.object().shape({
      id: yup.string().required('ID is a required field.')
    }),
    resolve: async (parent, { id }, { request, postService, commentService, logger, pubsub }) => {
      logger.info('PostMutation#deletePost.call', id)

      const author = await authUtils.getUser(request)
      const post = await postService.findOne({ where: { id, author } })

      logger.info('PostMutation#deletePost.check', !post)

      if (!post) {
        throw new Error('Post not found or you may not be the owner of the post')
      }

      const commentExists = (await commentService.count({ where: { post: id } })) >= 1

      if (commentExists) {
        throw new Error('Comment/s have already been posted for this post.')
      }

      const count = await postService.destroy(id)

      if (post.published) {
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: post
          }
        })
      }

      logger.info('PostMutation#deletePost.result', count, post)

      return { count }
    }
  }
}

export default PostMutation
