import { isEmpty, isNil } from 'lodash'

const posts = {
  authenticate: false,
  resolve: async (parent, { q, first, last, before, after }, { postService }) => {
    const query = {}

    if (!isEmpty(q)) Object.assign(query, { where: { title: { $like: q } } })

    if (!isNil(first)) Object.assign(query, { limit: first })

    if (!isEmpty(after)) {
      Object.assign(query, { after, limit: first })
    } else if (!isEmpty(before)) {
      Object.assign(query, { before, limit: last })
    }

    return postService.find(query)
  }
}

export default { posts }
