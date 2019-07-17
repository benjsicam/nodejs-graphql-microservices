const UserGraph = {
  async posts(parent, args, { postService }, info) {
    return postService.findAll({
      where: {
        author: parent.id
      }
    })
  },
  async comments(parent, args, { commentService }, info) {
    return commentService.findAll({
      where: {
        author: parent.id
      }
    })
  }
}

export default UserGraph
