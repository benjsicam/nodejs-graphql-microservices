const users = {
  resolve: async (parent, args, { userService }) => {
    let query = {}

    if (args.query) query = { where: { name: { $like: args.query } } }

    return userService.findAll(query)
  }
}

export default { users }
