const post = {
  authenticate: false,
  resolve: async (parent, { id }, { postsService }) => postsService.findById(id)
}

export default { post }
