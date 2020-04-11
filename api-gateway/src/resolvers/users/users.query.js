import { isEmpty, isNil } from 'lodash'
import queryUtils from '../../utils/query'

const users = {
  authenticate: true,
  resolve: async (parent, {
    q, first, last, before, after, orderBy
  }, { userService }) => {
    const query = {}

    if (!isEmpty(q)) Object.assign(query, { where: { name: { $like: q } } })

    if (!isNil(first)) Object.assign(query, { limit: first })

    if (!isEmpty(after)) {
      Object.assign(query, { after, limit: first })
    } else if (!isEmpty(before)) {
      Object.assign(query, { before, limit: last })
    }

    if (!isEmpty(orderBy)) {
      const order = await queryUtils.getOrder(orderBy)

      Object.assign(query, { orderBy: order })
    }

    return userService.find(query)
  }
}

export default { users }
