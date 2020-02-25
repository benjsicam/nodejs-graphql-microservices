import { isEmpty, isNil } from 'lodash'

const users = {
  authenticate: true,
  resolve: async (parent, { q, first, last, before, after }, { userService }) => {
    const query = {}

    if (!isEmpty(q)) Object.assign(query, { where: { name: { $like: q } } })

    if (!isEmpty(after)) {
      Object.assign(query, { after, limit: !isNil(first) ? first : 25 })
    } else if (!isEmpty(before)) {
      Object.assign(query, { before, limit: !isNil(last) ? last : 25 })
    }

    return userService.find(query)
  }
}

export default { users }
