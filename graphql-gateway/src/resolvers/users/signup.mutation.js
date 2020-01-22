import * as yup from 'yup'

import authUtils from '../../utils/auth'
import passwordUtils from '../../utils/password'

const signup = {
  authRequired: false,
  validationSchema: yup.object().shape({
    data: yup.object().shape({
      name: yup
        .string()
        .trim()
        .required('Name is a required field.')
        .min('2', 'Name should at least be 2 characters.')
        .max('100', 'Name should be 100 characters at most.'),
      email: yup
        .string()
        .trim()
        .required('Email is a required field.')
        .email('Email field should contain a valid email.'),
      password: yup
        .string()
        .trim()
        .required('Password is a required field.')
        .min('8', 'Password should at least be 8 characters.')
        .max('50', 'Password should be 50 characters at most.'),
      age: yup
        .number()
        .integer()
        .moreThan('17', 'Age should at least be 18 years old.')
    })
  }),
  beforeResolve: async (args, { userService, logger }) => {
    const userExists = (await userService.count({ where: { email: args.data.email } })) >= 1

    logger.info('UserMutation#signup.check', userExists)

    if (userExists) {
      throw new Error('Email taken')
    }

    const password = await passwordUtils.hashPassword(args.data.password)

    return {
      data: {
        ...args.data,
        password
      }
    }
  },
  resolve: async (parent, { data }, { userService }) => {
    const user = await userService.create(data)

    return {
      user,
      token: await authUtils.generateToken(user.id)
    }
  }
}

export default { signup }
