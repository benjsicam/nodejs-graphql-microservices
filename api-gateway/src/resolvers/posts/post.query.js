const post = {
  authenticate: false,
  resolve: async (parent, { id }, { postService }) => {
    return postService.findById(id)
  },
}

export default { post }
