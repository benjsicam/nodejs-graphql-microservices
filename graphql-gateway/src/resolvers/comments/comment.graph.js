const CommentGraph = {
  async author(parent, args, { userService }, info) {
    return userService.findOne({
      query: {
        where: {
          id: parent.author
        }
      }
    })
  },
  async post(parent, args, { postService }, info) {
    return postService.findOne({
      query: {
        where: {
          id: parent.post
        }
      }
    })
  }
}

export { CommentGraph as default }
