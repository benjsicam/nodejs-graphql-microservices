const UserQuery = {
  async users(parent, args, { userService, logger }) {
    logger.info('UserQuery#users.call')

    const users = await userService.findAll()

    logger.info('UserQuery#users.result', users)

    return users
  }
}

export default UserQuery
