import { isString, isNumber } from 'lodash'

const UserMutation = {
  async createUser(parent, { data }, { userService, logger }) {
    logger.info('UserMutation#createUser.call', data)

    const userExists = (await userService.count({ where: { email: data.email } })) >= 1

    logger.info('UserMutation#createUser.check', userExists)

    if (userExists) {
      throw new Error('Email taken')
    }

    const user = await userService.create(data)

    logger.info('UserMutation#createUser.result', user)

    return user
  },
  async updateUser(parent, args, { userService, logger }) {
    const { id, data } = args

    logger.info('UserMutation#updateUser.call', id, data)

    const user = await userService.findOne({ where: { id } })

    logger.info('UserMutation#updateUser.target', user)

    if (!user) {
      throw new Error('User not found')
    }

    if (isString(data.email)) {
      const userExists = (await userService.count({ where: { email: data.email } })) >= 1

      if (userExists) {
        throw new Error('Email taken')
      }

      user.email = data.email
    }

    if (isString(data.name)) {
      user.name = data.name
    }

    if (isNumber(data.age)) {
      user.age = data.age
    }

    const updatedUser = await userService.update(id, user)

    logger.info('UserMutation#updateUser.result', updatedUser)

    return updatedUser
  },
  async deleteUser(parent, { id }, { userService, logger }) {
    logger.info('UserMutation#deleteUser.result', id)

    const user = await userService.findOne({ where: { id } })

    if (!user) {
      throw new Error('User not found')
    }

    const count = await userService.destroy(id)

    logger.info('UserMutation#deleteUser.result', count, user)

    return count
  }
}

export default UserMutation
