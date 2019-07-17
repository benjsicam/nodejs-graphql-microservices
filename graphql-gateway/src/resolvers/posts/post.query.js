const PostQuery = {
  async posts(parent, args, { postService, logger }, info) {
    logger.info('PostQuery#posts.call')

    const posts = await postService.findAll()

    logger.info('PostQuery#posts.result', posts)

    return posts
  }
}

export default PostQuery
