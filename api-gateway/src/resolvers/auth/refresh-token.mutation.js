import authUtils from '../../utils/auth'

const refreshToken = {
  authenticate: async (parent, args, { authenticate }) => {
    const { user } = await authenticate('jwt-refresh', { session: false })

    return user
  },
  resolve: async (parent, args, { res, user }) => {
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

export default { refreshToken }
