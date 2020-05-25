const logout = {
  authenticate: false,
  resolve: async (parent, args, { res, user }) => {
    res.cookie('access-token', '', {
      httpOnly: true,
      maxAge: 0
    })
    res.cookie('refresh-token', '', {
      httpOnly: true,
      maxAge: 0
    })

    return true
  }
}

export default { logout }
