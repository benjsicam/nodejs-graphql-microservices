const UserQuery = {
  async users(parent, args, { userService }, info) {
    return userService.findAll()
  }
}

export default UserQuery
