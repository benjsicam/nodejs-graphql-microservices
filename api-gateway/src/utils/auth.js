import jwt from 'jsonwebtoken'

import { jwtConfig } from '../config'

const authUtils = {
  async generateAccessToken (userId) {
    return jwt.sign({ userId }, jwtConfig.accessTokenSecret, {
      subject: userId,
      audience: jwtConfig.audience,
      issuer: jwtConfig.issuer,
      expiresIn: '30min'
    })
  },
  async generateRefreshToken (userId) {
    return jwt.sign({ userId }, jwtConfig.refreshTokenSecret, {
      subject: userId,
      audience: jwtConfig.audience,
      issuer: jwtConfig.issuer,
      expiresIn: '2d'
    })
  }
}

export default authUtils
