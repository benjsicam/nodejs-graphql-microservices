import { withFilter } from 'apollo-server'

const commentAdded = {
  authenticate: false,
  subscribe: withFilter(async (parent, { post }, { postService, pubsub }) => {
    const postExists = (await postService.count({ where: { id: post, published: true } })) >= 1

    if (!postExists) throw new Error('Unable to find post')

    return pubsub.asyncIterator('commentAdded')
  }, (payload, variables) => payload.post === variables.post),
  resolve: payload => payload
}

export default { commentAdded }
