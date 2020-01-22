import * as yup from 'yup'

import { isString, isNumber } from 'lodash'

import authUtils from '../../utils/auth'

const updateProfile = {
  authRequired: true,
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
  beforeResolve: async (args, { request, userService, logger }) => {
    const { data } = args
    const user = await userService.findOne({ where: { id: args.user } })

    logger.info('UserMutation#updateProfile.target', user)

    if (!user) {
      throw new Error(['User profile not found'])
    }

    if (isString(data.name)) {
      user.name = data.name
    }

    if (isNumber(data.age)) {
      user.age = data.age
    }

    return { id: args.user, user }
  },
  resolve: async (parent, { id, user }, { userService }) => {
    const updatedUser = await userService.update(id, user)

    return { user: updatedUser }
  }
}

export default { updateProfile }
