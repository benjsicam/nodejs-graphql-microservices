import { isEmpty, merge } from 'lodash'
import queryUtils from '../../utils/query'

const users = {
  authenticate: true,
  resolve: async (parent, {
    q, first, last, before, after, filterBy, orderBy
  }, { userService }) => {
    const query = {}

    if (!isEmpty(q)) Object.assign(query, { where: { name: { _iLike: q } } })

    merge(query, await queryUtils.buildQuery(filterBy, orderBy, first, last, before, after))

    return userService.find(query)
  }
}

export default { users }
