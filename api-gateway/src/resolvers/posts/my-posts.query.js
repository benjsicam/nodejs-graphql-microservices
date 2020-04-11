import { isEmpty, isNil } from 'lodash'
import queryUtils from '../../utils/query'

const myPosts = {
  authenticate: true,
  resolve: async (parent, {
    q, first, last, before, after, user, orderBy
  }, { postService }) => {
    const query = { where: { author: user } }

    if (!isEmpty(q)) Object.assign(query.where, { author: user, title: { $like: q } })

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

    return postService.find(query)
  }
}

export default { myPosts }
