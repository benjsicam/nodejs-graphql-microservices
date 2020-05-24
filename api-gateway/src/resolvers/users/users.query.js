import { isEmpty, merge } from 'lodash'
import queryUtils from '../../utils/query'

const users = {
  authenticate: true,
  resolve: async (parent, { q, first, last, before, after, filterBy, orderBy }, { usersService }) => {
    const query = {}

    if (!isEmpty(q)) merge(query, { where: { name: { _iLike: q } } })

    merge(query, await queryUtils.buildQuery(filterBy, orderBy, first, last, before, after))

    return usersService.find(query)
  }
}

export default { users }
