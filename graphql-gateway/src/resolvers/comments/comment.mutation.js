import { isString } from 'lodash'

const CommentMutation = {
  async createComment(parent, { data }, { commentService, postService, userService, pubsub }, info) {
    const userExists = (await userService.count({ query: { where: { id: data.author } } })) >= 1
    const postExists =
      (await postService.count({
        query: { where: { id: data.post, published: true } }
      })) >= 1

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

    return comment
  },
  async updateComment(parent, args, { commentService, pubsub }, info) {
    const { id, data } = args
    const comment = await commentService.findOne({ query: { where: { id } } })

    if (!comment) {
      throw new Error('Comment not found')
    }

    if (isString(data.text)) {
      comment.text = data.text
    }

    await commentService.update({ id, data: comment })

    pubsub.publish(`comment#${comment.post}`, {
      comment: {
        mutation: 'UPDATED',
        data: comment
      }
    })

    return comment
  },
  async deleteComment(parent, { id }, { commentService, pubsub }, info) {
    const comment = await commentService.findOne({ query: { where: { id } } })

    if (!comment) {
      throw new Error('Comment not found')
    }

    await commentService.destroy({ id })

    pubsub.publish(`comment#${comment.post}`, {
      comment: {
        mutation: 'DELETED',
        data: comment
      }
    })

    return comment
  }
}

export default CommentMutation
