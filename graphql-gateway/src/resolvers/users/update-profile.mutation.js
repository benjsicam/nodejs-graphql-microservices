import * as yup from 'yup'

import { isString, isNumber } from 'lodash'

import authUtils from '../../utils/auth'
import errorUtils from '../../utils/error'

const updateProfile = {
  validationSchema: yup.object().shape({
    data: yup.object().shape({
      name: yup
        .string()
        .trim()
        .min('2', 'Name should at least be 2 characters.')
        .max('100', 'Name should be 100 characters at most.'),
      age: yup
        .number()
        .integer()
        .moreThan('17', 'Age should at least be 18 years old.')
    })
  }),
  resolve: async (parent, { data }, { request, userService, logger }) => {
    const id = await authUtils.getUser(request)
    const user = await userService.findOne({ where: { id } })

    logger.info('UserMutation#updateProfile.target', user)

    if (!user) {
      return errorUtils.buildError(['User profile not found'])
    }

    if (isString(data.name)) {
      user.name = data.name
    }

    if (isNumber(data.age)) {
      user.age = data.age
    }

    const updatedUser = await userService.update(id, user)

    return { user: updatedUser }
  }
}

export default { updateProfile }
