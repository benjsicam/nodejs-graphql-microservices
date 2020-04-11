import * as yup from 'yup'
import bcrypt from 'bcryptjs'

import { isEmpty, isNil } from 'lodash'

import authUtils from '../../utils/auth'

const login = {
  authenticate: false,
  validationSchema: yup.object().shape({
    data: yup.object().shape({
      email: yup.string().trim().required('Email is a required field.').email('Email field should contain a valid email.'),
      password: yup.string().trim().required('Password is a required field.')
    })
  }),
  resolve: async (parent, { data }, { userService, logger }) => {
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

    return {
      user,
      token: await authUtils.generateToken(user.id)
    }
  }
}

export default { login }
