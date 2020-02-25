import { isEmpty, isNil } from 'lodash'

const myPosts = {
  authenticate: true,
  resolve: async (parent, { q, first, last, before, after, user }, { postService }) => {
    const query = { where: { author: user } }

    if (!isEmpty(q)) Object.assign(query.where, { author: user, title: { $like: q } })

    if (!isNil(first)) Object.assign(query, { limit: first })

    if (!isEmpty(after)) {
      Object.assign(query, { after, limit: first })
    } else if (!isEmpty(before)) {
      Object.assign(query, { before, limit: last })
    }

    return postService.find(query)
  }
}

export default { myPosts }
