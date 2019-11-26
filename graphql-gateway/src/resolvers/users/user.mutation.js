import * as yup from 'yup'
import bcrypt from 'bcryptjs'

import { isEmpty, isString, isNumber } from 'lodash'

import authUtils from '../../utils/auth'
import passwordUtils from '../../utils/password'
import errorUtils from '../../utils/error'

const UserMutation = {
  signup: {
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
    resolve: async (parent, { data }, { userService, logger }) => {
      logger.info('UserMutation#signup.call', data)

      const userExists = (await userService.count({ where: { email: data.email } })) >= 1

      logger.info('UserMutation#signup.check', userExists)

      if (userExists) {
        return errorUtils.buildError(['Email taken'])
      }

      const password = await passwordUtils.hashPassword(data.password)

      const user = await userService.create({
        ...data,
        password
      })

      delete user.password

      logger.info('UserMutation#signup.result', user)

      return {
        user,
        token: await authUtils.generateToken(user.id)
      }
    }
  },
  login: {
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
      logger.info('UserQuery#login.call', data)

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

      delete user.password

      logger.info('UserQuery#login.result', user)

      return {
        user,
        token: await authUtils.generateToken(user.id)
      }
    }
  },
  updateProfile: {
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
      logger.info('UserMutation#updateProfile.call', data)

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

      delete updatedUser.password

      logger.info('UserMutation#updateProfile.result', updatedUser)

      return { user: updatedUser }
    }
  },
  updateEmail: {
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
      logger.info('UserMutation#updateEmail.call', data)

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

      delete updatedUser.password

      logger.info('UserMutation#updateEmail.result', updatedUser)

      return {
        user: updatedUser,
        token: await authUtils.generateToken(user.id)
      }
    }
  },
  updatePassword: {
    validationSchema: yup.object().shape({
      data: yup.object().shape({
        currentPassword: yup
          .string()
          .trim()
          .required('Current Password is a required field.'),
        newPassword: yup
          .string()
          .trim()
          .required('New Password is a required field.')
          .min('8', 'New Password should at least be 8 characters.')
          .max('50', 'New Password should be 50 characters at most.'),
        confirmPassword: yup
          .string()
          .trim()
          .required('Confirm Password is a required field.')
          .min('8', 'Confirm Password should at least be 8 characters.')
          .max('50', 'Confirm Password should be 50 characters at most.')
      })
    }),
    resolve: async (parent, { data }, { request, userService, logger }) => {
      logger.info('UserMutation#updatePassword.call', data)

      const id = await authUtils.getUser(request)
      const user = await userService.findOne({ where: { id } })
      const isMatch = await bcrypt.compare(data.currentPassword, user.password)
      const isConfirmed = data.newPassword === data.confirmPassword

      logger.info('UserMutation#updatePassword.target', user)
      logger.info('UserMutation#updatePassword.check', !user || !isMatch || !isConfirmed)

      if (!user || !isMatch || !isConfirmed) {
        return errorUtils.buildError(['Error updating password. Kindly check your passwords.'])
      }

      const password = await passwordUtils.hashPassword(data.newPassword)

      const updatedUser = await userService.update(id, {
        ...user,
        password
      })

      delete updatedUser.password

      logger.info('UserMutation#updatePassword.result', updatedUser)

      return {
        user: updatedUser,
        token: await authUtils.generateToken(user.id)
      }
    }
  },
  async deleteAccount(parent, args, { request, commentService, postService, userService, logger }) {
    logger.info('UserMutation#deleteAccount.call')

    const id = await authUtils.getUser(request)
    const user = await userService.findOne({ where: { id } })

    logger.info('UserMutation#deleteAccount.check1', !user)

    if (!user) {
      return errorUtils.buildError(['User not found'])
    }

    const postExists = (await postService.count({ where: { author: id } })) >= 1
    const commentExists = (await commentService.count({ where: { author: id } })) >= 1

    logger.info('UserMutation#deleteAccount.check1', postExists || commentExists)

    if (postExists || commentExists) {
      return errorUtils.buildError(['You have already made posts and comments. Kindly delete those first.'])
    }

    const count = await userService.destroy(id)

    delete user.password

    logger.info('UserMutation#deleteAccount.result', count, user)

    return { count }
  }
}

export default UserMutation
