import { isEmpty, isNil } from 'lodash'

const comments = {
  authenticate: false,
  resolve: async (parent, { q, first, last, before, after }, { commentService }) => {
    const query = {}

    if (!isEmpty(q)) Object.assign(query, { where: { text: { $like: q } } })

    if (!isNil(first)) Object.assign(query, { limit: first })

    if (!isEmpty(after)) {
      Object.assign(query, { after, limit: first })
    } else if (!isEmpty(before)) {
      Object.assign(query, { before, limit: last })
    }

    return commentService.find(query)
  }
}

export default { comments }
