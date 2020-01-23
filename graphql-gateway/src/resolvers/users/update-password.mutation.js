import * as yup from 'yup'
import bcrypt from 'bcryptjs'

import authUtils from '../../utils/auth'
import passwordUtils from '../../utils/password'

const updatePassword = {
  authRequired: true,
  validationSchema: yup.object().shape({
    data: yup.object().shape({
      currentPassword: yup
        .string()
        .trim()
        .required('Current Password is a required field.'),
      newPassword: yup
        .string()
        .trim()
        .required('New Password is a required field.')
        .min('8', 'New Password should at least be 8 characters.')
        .max('50', 'New Password should be 50 characters at most.'),
      confirmPassword: yup
        .string()
        .trim()
        .required('Confirm Password is a required field.')
        .min('8', 'Confirm Password should at least be 8 characters.')
        .max('50', 'Confirm Password should be 50 characters at most.')
    })
  }),
  beforeResolve: async (args, { request, userService, logger }) => {
    const { data } = args
    const user = await userService.findOne({ where: { id: args.user } })
    const isMatch = await bcrypt.compare(data.currentPassword, user.password)
    const isConfirmed = data.newPassword === data.confirmPassword

    logger.info('UserMutation#updatePassword.target', user)
    logger.info('UserMutation#updatePassword.check', !user || !isMatch || !isConfirmed)

    if (!user || !isMatch || !isConfirmed) {
      throw new Error('Error updating password. Kindly check your passwords.')
    }

    const password = await passwordUtils.hashPassword(data.newPassword)

    return { id: args.user, user, password }
  },
  resolve: async (parent, { id, user, password }, { userService }) => {
    const updatedUser = await userService.update(id, {
      ...user,
      password
    })

    return {
      user: updatedUser,
      token: await authUtils.generateToken(user.id)
    }
  }
}

export default { updatePassword }
