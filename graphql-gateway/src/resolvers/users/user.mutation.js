import uuidv4 from 'uuid/v4'
import { isString, isNumber } from 'lodash'

const UserMutation = {
  async createUser(parent, { data }, { userService }, info) {
    const userExists = (await userService.count({ where: { email: data.email } })) >= 1

    if (userExists) {
      throw new Error('Email taken')
    }

    const user = await userService.create({
      id: uuidv4(),
      ...data
    })

    return user
  },
  async updateUser(parent, args, { userService }, info) {
    const { id, data } = args
    const user = await userService.findOne({ where: { id } })

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

    await userService.update(id, user)

    return user
  },
  async deleteUser(parent, { id }, { userService }, info) {
    const user = await userService.findOne({ where: { id } })

    if (!user) {
      throw new Error('User not found')
    }

    await userService.destroy(id)

    return user
  }
}

export default UserMutation
