import * as yup from 'yup'

import passwordUtils from '../../utils/password'

const updatePassword = {
  authenticate: true,
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
  resolve: async (parent, args, { user, userService, logger }) => {
    const { data } = args
    const isSame = await passwordUtils.verify(data.currentPassword, user.password)
    const isConfirmed = data.newPassword === data.confirmPassword

    logger.info('UserMutation#updatePassword.check', !isSame || !isConfirmed)

    if (!isSame || !isConfirmed) {
      throw new Error('Error updating password. Kindly check your passwords.')
    }

    const password = await passwordUtils.hash(data.newPassword)

    const updatedUser = await userService.update(user.id, {
      ...user,
      password
    })

    return {
      user: updatedUser
    }
  }
}

export default { updatePassword }
