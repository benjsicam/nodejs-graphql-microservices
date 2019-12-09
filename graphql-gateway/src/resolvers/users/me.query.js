import authUtils from '../../utils/auth'

const me = {
  resolve: async (parent, args, { request, userService }) => {
    const id = await authUtils.getUser(request)
    const user = await userService.findOne({ where: { id } })

    return user
  }
}

export default { me }
