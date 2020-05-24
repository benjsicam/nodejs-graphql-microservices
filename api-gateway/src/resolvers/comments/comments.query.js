import { isEmpty, merge } from 'lodash'
import queryUtils from '../../utils/query'

const comments = {
  authenticate: false,
  resolve: async (parent, { q, first, last, before, after, filterBy, orderBy }, { commentsService }) => {
    const query = {}

    if (!isEmpty(q)) merge(query, { where: { text: { _iLike: q } } })

    merge(query, await queryUtils.buildQuery(filterBy, orderBy, first, last, before, after))

    return commentsService.find(query)
  }
}

export default { comments }
