import { withFilter } from 'apollo-server'

const commentAdded = {
  authenticate: false,
  subscribe: withFilter(
    (parent, args, { pubsub }) => pubsub.asyncIterator('commentAdded'),
    (payload, variables) => payload.post === variables.post
  ),
  resolve: (payload) => payload
}

export default { commentAdded }
