import * as yup from 'yup'

import { clone, isString, isNumber, set } from 'lodash'

const updateProfile = {
  authenticate: true,
  validationSchema: yup.object().shape({
    data: yup.object().shape({
      name: yup.string().trim().min('2', 'Name should at least be 2 characters.').max('100', 'Name should be 100 characters at most.'),
      age: yup.number().integer().moreThan('17', 'Age should at least be 18 years old.')
    })
  }),
  resolve: async (parent, args, { user, usersService, logger }) => {
    const { data } = args

    logger.info('UserMutation#updateProfile.target %o', user)

    const updates = clone(user)

    if (isString(data.name)) {
      set(updates, 'name', data.name)
    }

    if (isNumber(data.age)) {
      set(updates, 'age', data.age)
    }

    const updatedUser = await usersService.update(user.id, updates)

    return { user: updatedUser }
  }
}

export default { updateProfile }
