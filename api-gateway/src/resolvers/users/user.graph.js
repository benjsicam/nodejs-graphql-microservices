import { isEmpty, merge } from 'lodash'
import queryUtils from '../../utils/query'

const UserGraph = {
  posts: {
    resolve: async (parent, {
      q, first, last, before, after, filterBy, orderBy
    }, { postService }) => {
      const query = {}

      if (!isEmpty(q)) Object.assign(query, { where: { title: { _iLike: q } } })

      merge(query, await queryUtils.buildQuery(filterBy, orderBy, first, last, before, after))

      return postService.find(query)
    }
  },
  comments: {
    resolve: async (parent, {
      q, first, last, before, after, filterBy, orderBy
    }, { commentService }) => {
      const query = {}

      if (!isEmpty(q)) Object.assign(query, { where: { text: { _iLike: q } } })

      merge(query, await queryUtils.buildQuery(filterBy, orderBy, first, last, before, after))

      return commentService.find(query)
    }
  }
}

export default UserGraph
