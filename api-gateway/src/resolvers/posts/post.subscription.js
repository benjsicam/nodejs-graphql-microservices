const post = {
  subscribe: {
    authenticate: false,
    resolve: async (parent, args, { pubsub }) => {
      return pubsub.asyncIterator('post')
    }
  }
}

export default { post }
