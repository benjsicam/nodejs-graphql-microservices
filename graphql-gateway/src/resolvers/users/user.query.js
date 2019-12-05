import authUtils from '../../utils/auth'

const UserQuery = {
  user: {
    resolve: async (parent, { id }, { userService, logger }) => {
      logger.info('UserQuery#user.call', id)
  
      const user = await userService.findOne({ where: { id } })
  
      logger.info('UserQuery#user.result', user)
  
      return user
    }
  },
  users: {
    resolve: async (parent, args, { userService, logger }) => {
      logger.info('UserQuery#users.call', args)
  
      let query = {}
  
      if (args.query) query = { where: { name: { $like: args.query } } }
  
      const users = await userService.findAll(query)
  
      logger.info('UserQuery#users.result', users)
  
      return users
    }
  },
  userCount: {
    resolve: async (parent, args, { userService, logger }) => {
      logger.info('UserQuery#userCount.call', args)
  
      let query = {}
  
      if (args.query) query = { where: { name: { $like: args.query } } }
  
      const count = await userService.count(query)
  
      logger.info('UserQuery#userCount.result', count)
  
      return count
    }
  },
  me: {
    resolve: async (parent, args, { request, userService, logger }) => {
      logger.info('UserQuery#me.call')
  
      const id = await authUtils.getUser(request)
      const user = await userService.findOne({ where: { id } })
  
      delete user.password
  
      logger.info('UserQuery#me.result', user)
  
      return user
    }
  }
}

export default UserQuery
