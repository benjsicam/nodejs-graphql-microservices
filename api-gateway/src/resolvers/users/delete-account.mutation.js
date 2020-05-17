const deleteAccount = {
  authenticate: true,
  resolve: async (parent, args, { user, userService }) => {
    const count = await userService.destroy({
      where: { id: user.id }
    })

    return { count }
  }
}

export default { deleteAccount }
