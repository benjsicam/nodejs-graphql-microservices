import * as yup from 'yup'

const deletePost = {
  authRequired: true,
  validationSchema: yup.object().shape({
    id: yup.string().required('ID is a required field.')
  }),
  beforeResolve: async (args, { request, postService, commentService, logger }) => {
    const post = await postService.findOne({ where: { id: args.id, author: args.user } })

    logger.info('PostMutation#deletePost.check', !post)

    if (!post) {
      throw new Error('Post not found or you may not be the owner of the post')
    }

    const commentExists = (await commentService.count({ where: { post: args.id } })) >= 1

    if (commentExists) {
      throw new Error('Post not found or you may not be the owner of the post')
    }

    return {
      id: args.id,
      post
    }
  },
  resolve: async (parent, { id, post }, { postService }) => {
    const count = await postService.destroy(id)

    return { post, count }
  },
  afterResolve: async ({ post, count }, { pubsub }) => {
    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: post
        }
      })
    }

    return { count }
  }
}

export default { deletePost }
