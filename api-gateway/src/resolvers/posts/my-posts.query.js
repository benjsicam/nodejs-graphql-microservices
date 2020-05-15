import { isEmpty, merge } from 'lodash'
import queryUtils from '../../utils/query'

const myPosts = {
  authenticate: true,
  resolve: async (parent, {
    q, first, last, before, after, user, filterBy, orderBy
  }, { postService }) => {
    const query = { where: { author: user } }

    if (!isEmpty(q)) Object.assign(query.where, { author: user, title: { _iLike: q } })

    merge(query, await queryUtils.buildQuery(filterBy, orderBy, first, last, before, after))

    return postService.find(query)
  }
}

export default { myPosts }
