import { isEmpty } from 'lodash'

const commentCount = {
  authenticate: false,
  resolve: async (parent, { q }, { commentService }) => {
    const query = {}

    if (!isEmpty(q)) Object.assign(query, { where: { text: { $like: q } } })

    return commentService.count(query)
  }
}

export default { commentCount }
