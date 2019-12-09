const post = {
  subscribe: {
    resolve: async (parent, args, { pubsub }) => {
      return pubsub.asyncIterator('post')
    }
  }
}

export default { post }
