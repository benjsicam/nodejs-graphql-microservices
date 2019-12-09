import * as yup from 'yup'
import bcrypt from 'bcryptjs'

import authUtils from '../../utils/auth'
import errorUtils from '../../utils/error'

const updateEmail = {
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
  resolve: async (parent, { data }, { request, userService, logger }) => {
    const id = await authUtils.getUser(request)
    const user = await userService.findOne({ where: { id } })
    const isMatch = await bcrypt.compare(data.currentPassword, user.password)

    logger.info('UserMutation#updateEmail.target', user)
    logger.info('UserMutation#updateEmail.check1', !user || !isMatch)

    if (!user || !isMatch) {
      return errorUtils.buildError(['Error updating email. Kindly check the email or password provided'])
    }

    const userExists = (await userService.count({ where: { email: data.email } })) >= 1

    logger.info('UserMutation#updateEmail.check2', userExists)

    if (userExists) {
      return errorUtils.buildError(['Email taken'])
    }

    user.email = data.email

    const updatedUser = await userService.update(id, user)

    return {
      user: updatedUser,
      token: await authUtils.generateToken(user.id)
    }
  }
}

export default { updateEmail }
