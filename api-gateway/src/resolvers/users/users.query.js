import { isEmpty, isNil } from 'lodash'

const users = {
  authenticate: true,
  resolve: async (parent, { q, first, last, before, after }, { userService }) => {
    const query = {}

    if (!isEmpty(q)) Object.assign(query, { where: { name: { $like: q } } })

    if (!isNil(first)) Object.assign(query, { limit: first })

    if (!isEmpty(after)) {
      Object.assign(query, { after, limit: first })
    } else if (!isEmpty(before)) {
      Object.assign(query, { before, limit: last })
    }

    return userService.find(query)
  }
}

export default { users }
