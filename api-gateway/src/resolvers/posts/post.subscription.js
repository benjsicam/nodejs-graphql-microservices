const post = {
  subscribe: {
    authenticate: false,
    resolve: async (parent, args, { pubsub }) => pubsub.asyncIterator('post')
  }
}

export default { post }
