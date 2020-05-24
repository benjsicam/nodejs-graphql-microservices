const deleteAccount = {
  authenticate: true,
  resolve: async (parent, args, { user, usersService }) => {
    const count = await usersService.destroy({
      where: { id: user.id }
    })

    return { count }
  }
}

export default { deleteAccount }
