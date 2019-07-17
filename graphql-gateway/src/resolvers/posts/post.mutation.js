import uuidv4 from 'uuid/v4'
import { isString, isBoolean } from 'lodash'

const PostMutation = {
  async createPost(parent, { data }, { postService, userService, pubsub }, info) {
    const userExists = (await userService.count({ where: { id: data.author } })) >= 1

    if (!userExists) {
      throw new Error('User not found')
    }

    const post = await postService.create({
      id: uuidv4(),
      ...data
    })

    if (data.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: post
        }
      })
    }

    return post
  },
  async updatePost(parent, args, { postService, pubsub }, info) {
    const { id, data } = args
    const post = await postService.findOne({ where: { id } })
    const originalPost = { ...post }

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

    await postService.update(id, post)

    if (originalPost.published && !post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: originalPost
        }
      })
    } else if (!originalPost.published && post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: post
        }
      })
    } else if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: post
        }
      })
    }

    return post
  },
  async deletePost(parent, { id }, { postService, pubsub }, info) {
    const post = await postService.findOne({ where: { id } })

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

    return post
  }
}

export default PostMutation
