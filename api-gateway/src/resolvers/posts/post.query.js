const post = {
  authenticate: false,
  resolve: async (parent, { id }, { postService }) => postService.findById(id)
}

export default { post }
