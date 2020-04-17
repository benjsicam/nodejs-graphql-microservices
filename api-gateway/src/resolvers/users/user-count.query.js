const userCount = {
  authenticate: false,
  resolve: async (parent, { q }, { userService }) => {
    const query = {}

    if (q) Object.assign(query, { where: { name: { _iLike: q } } })

    return userService.count(query)
  }
}

export default { userCount }
