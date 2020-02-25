import { isEmpty, isNil } from 'lodash'

const posts = {
  authenticate: false,
  resolve: async (parent, { q, first, last, before, after }, { postService }) => {
    const query = {}

    if (!isEmpty(q)) Object.assign(query, { where: { title: { $like: q } } })

    if (!isEmpty(after)) {
      Object.assign(query, { after, limit: !isNil(first) ? first : 25 })
    } else if (!isEmpty(before)) {
      Object.assign(query, { before, limit: !isNil(last) ? last : 25 })
    }

    return postService.find(query)
  }
}

export default { posts }
