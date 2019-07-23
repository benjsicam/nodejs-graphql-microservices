import authUtils from '../../utils/auth'

const UserQuery = {
  async user(parent, { id }, { userService, logger }) {
    logger.info('UserQuery#user.call', id)

    const user = await userService.findOne({ where: { id } })

    logger.info('UserQuery#user.result', user)

    return user
  },
  async users(parent, args, { userService, logger }) {
    logger.info('UserQuery#users.call', args)

    let query = {}

    if (args.query) query = { where: { name: { $like: args.query } } }

    const users = await userService.findAll(query)

    logger.info('UserQuery#users.result', users)

    return users
  },
  async userCount(parent, args, { userService, logger }) {
    logger.info('UserQuery#userCount.call', args)

    let query = {}

    if (args.query) query = { where: { name: { $like: args.query } } }

    const count = await userService.count(query)

    logger.info('UserQuery#userCount.result', count)

    return count
  },
  async me(parent, args, { request, userService, logger }) {
    logger.info('UserQuery#me.call')

    const id = await authUtils.getUser(request)
    const user = await userService.findOne({ where: { id } })

    delete user.password

    logger.info('UserQuery#me.result', user)

    return user
  }
}

export default UserQuery
