const userCount = {
  authenticate: false,
  resolve: async (parent, { q }, { userService }) => {
    let query = {}

    if (q) query = { where: { name: { $like: q } } }

    return userService.count(query)
  }
}

export default { userCount }
