import { isString } from 'lodash'

const CommentMutation = {
  async createComment(parent, { data }, { commentService, postService, userService, logger, pubsub }) {
    logger.info('CommentMutation#createComment.call', data)

    const userExists = (await userService.count({ where: { id: data.author } })) >= 1
    const postExists = (await postService.count({ where: { id: data.post, published: true } })) >= 1

    logger.info('CommentMutation#createComment.check', !userExists, !postExists)

    if (!userExists || !postExists) {
      throw new Error('Unable to find user and post')
    }

    const comment = await commentService.create(data)

    pubsub.publish(`comment#${data.post}`, {
      comment: {
        mutation: 'CREATED',
        data: comment
      }
    })

    logger.info('CommentMutation#createComment.result', comment)

    return comment
  },
  async updateComment(parent, args, { commentService, logger, pubsub }) {
    const { id, data } = args

    logger.info('CommentMutation#updateComment.call', id, data)

    const comment = await commentService.findOne({ where: { id } })

    logger.info('CommentMutation#updateComment.target', comment)

    if (!comment) {
      throw new Error('Comment not found')
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

    return updatedComment
  },
  async deleteComment(parent, { id }, { commentService, logger, pubsub }) {
    logger.info('CommentMutation#deleteComment.call', id)

    const comment = await commentService.findOne({ where: { id } })

    logger.info('CommentMutation#deleteComment.check', !comment)

    if (!comment) {
      throw new Error('Comment not found')
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

export default CommentMutation
