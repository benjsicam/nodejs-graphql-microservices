import { isEmpty, merge } from 'lodash'
import queryUtils from '../../utils/query'

const posts = {
  authenticate: false,
  resolve: async (parent, {
    q, first, last, before, after, filterBy, orderBy
  }, { postService }) => {
    const query = {}

    if (!isEmpty(q)) merge(query, { where: { title: { _iLike: q } } })

    merge(query, await queryUtils.buildQuery(filterBy, orderBy, first, last, before, after))

    return postService.find(query)
  }
}

export default { posts }
