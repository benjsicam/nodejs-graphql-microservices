import * as yup from 'yup'

import { isEmpty, isNil } from 'lodash'

import authUtils from '../../utils/auth'
import passwordUtils from '../../utils/password'

const login = {
  authenticate: false,
  validationSchema: yup.object().shape({
    data: yup.object().shape({
      email: yup.string().trim().required('Email is a required field.').email('Email field should contain a valid email.'),
      password: yup.string().trim().required('Password is a required field.')
    })
  }),
  resolve: async (parent, { data }, { res, usersService, logger }) => {
    const user = await usersService.findOne({
      where: {
        email: data.email
      }
    })

    logger.info('UserQuery#login.check1 %o', isEmpty(user))

    if (isEmpty(user) || isNil(user)) {
      throw new Error('Unable to login')
    }

    const isSame = await passwordUtils.verify(data.password, user.password)

    logger.info('UserQuery#login.check2 %o', !isSame)

    if (!isSame) {
      throw new Error('Unable to login')
    }

    res.cookie('access-token', await authUtils.generateAccessToken(user), {
      httpOnly: true,
      maxAge: 1.8e6
    })
    res.cookie('refresh-token', await authUtils.generateRefreshToken(user), {
      httpOnly: true,
      maxAge: 1.728e8
    })

    return {
      user
    }
  }
}

export default { login }
