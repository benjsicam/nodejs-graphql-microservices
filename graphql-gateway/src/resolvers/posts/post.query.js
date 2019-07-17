const PostQuery = {
  async posts(parent, args, { postService }, info) {
    return postService.findAll()
  }
}

export default PostQuery
