const userCount = {
  resolve: async (parent, args, { userService }) => {
    let query = {}

    if (args.query) query = { where: { name: { $like: args.query } } }

    return userService.count(query)
  }
}

export default { userCount }
