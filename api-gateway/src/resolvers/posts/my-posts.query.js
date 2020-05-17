import { isEmpty, merge } from 'lodash'
import queryUtils from '../../utils/query'

const myPosts = {
  authenticate: true,
  resolve: async (parent, {
    q, first, last, before, after, filterBy, orderBy
  }, { user, postService }) => {
    const query = { where: { author: user.id } }

    if (!isEmpty(q)) merge(query, { where: { title: { _iLike: q } } })

    merge(query, await queryUtils.buildQuery(filterBy, orderBy, first, last, before, after))

    return postService.find(query)
  }
}

export default { myPosts }
