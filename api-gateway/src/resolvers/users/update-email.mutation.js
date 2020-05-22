import * as yup from 'yup'

import passwordUtils from '../../utils/password'

const updateEmail = {
  authenticate: true,
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
  resolve: async (parent, args, { user, userService, logger }) => {
    const { data } = args
    const isSame = await passwordUtils.verify(data.currentPassword, user.password)

    logger.info('UserMutation#updateEmail.check1', !user || !isSame)

    if (!isSame) {
      throw new Error('Error updating email. Kindly check the email or password provided')
    }

    const emailTaken = (await userService.count({ where: { email: data.email } })) >= 1

    logger.info('UserMutation#updateEmail.check2', emailTaken)

    if (emailTaken) {
      throw new Error('Email taken')
    }

    const updatedUser = await userService.update(user.id, {
      ...user,
      email: data.email
    })

    return {
      user: updatedUser
    }
  }
}

export default { updateEmail }
