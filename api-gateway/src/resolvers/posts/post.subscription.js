const postAdded = {
  authenticate: false,
  subscribe: async (parent, args, { pubsub }) => pubsub.asyncIterator('postAdded'),
  resolve: (payload) => payload
}

export default { postAdded }
