import * as yup from 'yup'

import { isString } from 'lodash'

import authUtils from '../../utils/auth'

const CommentMutation = {
  createComment: {
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
      logger.info('CommentMutation#createComment.call', data)

      const author = await authUtils.getUser(request)

      const userExists = (await userService.count({ where: { id: author } })) >= 1
      const postExists = (await postService.count({ where: { id: data.post, published: true } })) >= 1

      logger.info('CommentMutation#createComment.check', !userExists, !postExists)

      if (!userExists || !postExists) {
        throw new Error('Unable to find user and post')
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

      logger.info('CommentMutation#createComment.result', comment)

      return { comment }
    }
  },
  updateComment: {
    validationSchema: yup.object().shape({
      id: yup.string().required('ID is a required field.'),
      data: yup.object().shape({
        text: yup
          .string()
          .trim()
          .min(5, 'Text should at least be 5 characters.')
          .max(500, 'Text should be 500 characters at most.')
      })
    }),
    resolve: async (parent, args, { request, commentService, logger, pubsub }) => {
      const { id, data } = args

      logger.info('CommentMutation#updateComment.call', id, data)

      const author = await authUtils.getUser(request)
      const comment = await commentService.findOne({ where: { id, author } })

      logger.info('CommentMutation#updateComment.target', comment)

      if (!comment) {
        throw new Error('Comment not found or you may not be the owner of the comment')
      }

      if (isString(data.text)) {
        comment.text = data.text
      }

      const updatedComment = await commentService.update(id, comment)

      pubsub.publish(`comment#${updatedComment.post}`, {
        comment: {
          mutation: 'UPDATED',
          data: updatedComment
        }
      })

      logger.info('CommentMutation#updateComment.result', updatedComment)

      return { updatedComment }
    }
  },
  deleteComment: {
    validationSchema: yup.object().shape({
      id: yup.string().required('ID is a required field.')
    }),
    resolve: async (parent, { id }, { request, commentService, logger, pubsub }) => {
      logger.info('CommentMutation#deleteComment.call', id)

      const author = await authUtils.getUser(request)
      const comment = await commentService.findOne({ where: { id, author } })

      logger.info('CommentMutation#deleteComment.check', !comment)

      if (!comment) {
        throw new Error('Comment not found or you may not be the owner of the comment')
      }

      const count = await commentService.destroy(id)

      pubsub.publish(`comment#${comment.post}`, {
        comment: {
          mutation: 'DELETED',
          data: comment
        }
      })

      logger.info('CommentMutation#deleteComment.result', count, comment)

      return count
    }
  }
}

export default CommentMutation
