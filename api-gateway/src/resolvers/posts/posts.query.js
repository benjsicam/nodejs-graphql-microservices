import { isEmpty, merge } from 'lodash'
import queryUtils from '../../utils/query'

const posts = {
  authenticate: false,
  resolve: async (parent, { q, first, last, before, after, filterBy, orderBy }, { postsService }) => {
    const query = {}

    if (!isEmpty(q)) merge(query, { where: { title: { _iLike: q } } })

    merge(query, await queryUtils.buildQuery(filterBy, orderBy, first, last, before, after))

    return postsService.find(query)
  }
}

export default { posts }
