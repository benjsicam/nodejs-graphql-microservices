import { isEmpty, merge } from 'lodash'
import queryUtils from '../../utils/query'

const commentCount = {
  authenticate: false,
  resolve: async (parent, { q, filterBy }, { commentsService }) => {
    const query = {}

    if (!isEmpty(q)) merge(query, { where: { text: { _iLike: q } } })

    merge(query, await queryUtils.getFilters(filterBy))

    return commentsService.count(query)
  }
}

export default { commentCount }
