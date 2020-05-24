import { isEmpty, merge } from 'lodash'
import queryUtils from '../../utils/query'

const userCount = {
  authenticate: false,
  resolve: async (parent, { q, filterBy }, { usersService }) => {
    const query = {}

    if (!isEmpty(q)) merge(query, { where: { name: { _iLike: q } } })

    merge(query, await queryUtils.getFilters(filterBy))

    return usersService.count(query)
  }
}

export default { userCount }
