import * as yup from 'yup'
import bcrypt from 'bcryptjs'

import { isEmpty } from 'lodash'

import authUtils from '../../utils/auth'
import errorUtils from '../../utils/error'

const login = {
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
  resolve: async (parent, { data }, { userService, logger }) => {
    const user = await userService.findOne({
      where: {
        email: data.email
      }
    })

    logger.info('UserQuery#login.check1', isEmpty(user))

    if (isEmpty(user)) {
      return errorUtils.buildError(['Unable to login'])
    }

    const isMatch = await bcrypt.compare(data.password, user.password)

    logger.info('UserQuery#login.check2', !isMatch)

    if (!isMatch) {
      return errorUtils.buildError(['Unable to login'])
    }

    return {
      user,
      token: await authUtils.generateToken(user.id)
    }
  }
}

export default { login }
