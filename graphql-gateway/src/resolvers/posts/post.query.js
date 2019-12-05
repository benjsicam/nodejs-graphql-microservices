import authUtils from '../../utils/auth'

const PostQuery = {
  post: {
    resolve: async (parent, { id }, { postService, logger }) => {
      logger.info('PostQuery#post.call', id)
  
      const post = await postService.findOne({ where: { id } })
  
      logger.info('PostQuery#post.result', post)
  
      return post
    }
  },
  posts: {
    resolve: async (parent, args, { postService, logger }) => {
      logger.info('PostQuery#posts.call', args)
  
      let query = {}
  
      if (args.query) query = { where: { title: { $like: args.query } } }
  
      const posts = await postService.findAll(query)
  
      logger.info('PostQuery#posts.result', posts)
  
      return posts
    }
  },
  postCount: {
    resolve: async (parent, args, { postService, logger }) => {
      logger.info('PostQuery#postCount.call', args)
  
      let query = {}
  
      if (args.query) query = { where: { title: { $like: args.query } } }
  
      const count = await postService.count(query)
  
      logger.info('PostQuery#postCount.result', count)
  
      return count
    }
  },
  myPosts:{
    resolve: async (parent, args, { request, postService, logger }) => {
      logger.info('PostQuery#myPosts.call', args)
  
      const author = await authUtils.getUser(request)
  
      let query = { where: { author } }
  
      if (args.query) query = { where: { author, title: { $like: args.query } } }
  
      const posts = await postService.findAll(query)
  
      logger.info('PostQuery#myPosts.result', posts)
  
      return posts
    }
  }
}

export default PostQuery
