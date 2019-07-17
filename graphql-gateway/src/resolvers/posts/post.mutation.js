import { isString, isBoolean } from 'lodash'

const PostMutation = {
  async createPost(parent, { data }, { postService, userService, logger, pubsub }, info) {
    logger.info('PostMutation#createPost.call', data)

    const userExists = (await userService.count({ where: { id: data.author } })) >= 1

    logger.info('PostMutation#createPost.check', !userExists)

    if (!userExists) {
      throw new Error('User not found')
    }

    const post = await postService.create(data)

    if (data.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: post
        }
      })
    }

    logger.info('PostMutation#createPost.result', post)

    return post
  },
  async updatePost(parent, args, { postService, logger, pubsub }, info) {
    const { id, data } = args

    logger.info('PostMutation#updatePost.call', id, data)

    const post = await postService.findOne({ where: { id } })
    const originalPost = { ...post }

    logger.info('PostMutation#updatePost.target', post)

    if (!post) {
      throw new Error('Post not found')
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

    return updatedPost
  },
  async deletePost(parent, { id }, { postService, logger, pubsub }, info) {
    logger.info('PostMutation#deletePost.call', id)

    const post = await postService.findOne({ where: { id } })

    logger.info('PostMutation#deletePost.check', !post)

    if (!post) {
      throw new Error('Post not found')
    }

    await postService.destroy(id)

    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: post
        }
      })
    }

    logger.info('PostMutation#deletePost.result', post)

    return post
  }
}

export default PostMutation
