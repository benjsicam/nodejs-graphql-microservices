import * as yup from 'yup'
import bcrypt from 'bcryptjs'

import { isEmpty, isNil } from 'lodash'

import authUtils from '../../utils/auth'

const login = {
  authRequired: false,
  validationSchema: yup.object().shape({
    data: yup.object().shape({
      email: yup
        .string()
        .trim()
        .required('Email is a required field.')
        .email('Email field should contain a valid email.'),
      password: yup
        .string()
        .trim()
        .required('Password is a required field.')
    })
  }),
  beforeResolve: async (args, { userService, logger }) => {
    const { data } = args

    const user = await userService.findOne({
      where: {
        email: data.email
      }
    })

    logger.info('UserQuery#login.check1', isEmpty(user))

    if (isEmpty(user) || isNil(user)) {
      throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(data.password, user.password)

    logger.info('UserQuery#login.check2', !isMatch)

    if (!isMatch) {
      throw new Error('Unable to login')
    }

    return { user, isMatch }
  },
  resolve: async (parent, { user, isMatch }, { userService, logger }) => {
    if (!isMatch) {
      throw new Error('Unable to login')
    } else {
      return {
        user,
        token: await authUtils.generateToken(user.id)
      }
    }
  }
}

export default { login }
