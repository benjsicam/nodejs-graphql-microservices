import jwt from 'jsonwebtoken'

import { jwtConfig } from '../config'

const authUtils = {
  async generateAccessToken(user) {
    return jwt.sign({ user: user.email }, jwtConfig.accessTokenSecret, {
      subject: user.id,
      audience: jwtConfig.audience,
      issuer: jwtConfig.issuer,
      expiresIn: '30min'
    })
  },
  async generateRefreshToken(user) {
    return jwt.sign({ user: user.email }, jwtConfig.refreshTokenSecret, {
      subject: user.id,
      audience: jwtConfig.audience,
      issuer: jwtConfig.issuer,
      expiresIn: '2d'
    })
  }
}

export default authUtils
