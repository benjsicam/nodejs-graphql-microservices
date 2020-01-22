import * as yup from 'yup'
import bcrypt from 'bcryptjs'

import authUtils from '../../utils/auth'

const updateEmail = {
  authRequired: true,
  validationSchema: yup.object().shape({
    data: yup.object().shape({
      email: yup
        .string()
        .trim()
        .required('Email is a required field.')
        .email('Email field should contain a valid email.'),
      currentPassword: yup
        .string()
        .trim()
        .required('Password is a required field.')
    })
  }),
  beforeResolve: async (args, { request, userService, logger }) => {
    const { data } = args
    const user = await userService.findOne({ where: { id: args.user } })
    const isMatch = await bcrypt.compare(data.currentPassword, user.password)

    logger.info('UserMutation#updateEmail.target', user)
    logger.info('UserMutation#updateEmail.check1', !user || !isMatch)

    if (!user || !isMatch) {
      throw new Error('Error updating email. Kindly check the email or password provided')
    }

    const userExists = (await userService.count({ where: { email: data.email } })) >= 1

    logger.info('UserMutation#updateEmail.check2', userExists)

    if (userExists) {
      throw new Error('Email taken')
    }

    user.email = data.email

    return { id: args.user, user }
  },
  resolve: async (parent, { id, user }, { userService }) => {
    const updatedUser = await userService.update(id, user)

    return {
      user: updatedUser,
      token: await authUtils.generateToken(user.id)
    }
  }
}

export default { updateEmail }
