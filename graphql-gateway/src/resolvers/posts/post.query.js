const post = {
  authRequired: false,
  resolve: async (parent, { id }, { postService }) => {
    return postService.findOne({ where: { id } })
  }
}

export default { post }
