import jwt from 'jsonwebtoken'

import { get } from 'lodash'

import { jwtConfig } from '../config'

const authUtils = {
  async getUser (request, requireAuth = true) {
    const header = get(request, 'headers.authorization') || get(request, 'connection.context.Authorization')

    if (header) {
      const token = header.replace('Bearer ', '')
      const decoded = jwt.verify(token, jwtConfig.secret)

      return decoded.userId
    }

    if (requireAuth) {
      throw new Error('Authentication required')
    }

    return null
  },
  async generateToken (userId) {
    return jwt.sign({ userId }, jwtConfig.secret)
  }
}

export default authUtils
