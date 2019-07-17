const PostGraph = {
  async author(parent, args, { userService }, info) {
    return userService.findOne({
      where: {
        id: parent.author
      }
    })
  },
  async comments(parent, args, { commentService }, info) {
    return commentService.findAll({
      where: {
        post: parent.id
      }
    })
  }
}

export { PostGraph as default }
