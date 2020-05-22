import { isEmpty, merge } from 'lodash'
import queryUtils from '../../utils/query'

const userCount = {
  authenticate: false,
  resolve: async (parent, { q, filterBy }, { userService }) => {
    const query = {}

    if (!isEmpty(q)) merge(query, { where: { name: { _iLike: q } } })

    merge(query, await queryUtils.getFilters(filterBy))

    return userService.count(query)
  }
}

export default { userCount }
