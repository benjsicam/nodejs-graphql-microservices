import { isEmpty, merge } from 'lodash'
import queryUtils from '../../utils/query'

const UserGraph = {
  posts: {
    resolve: async (parent, { q, first, last, before, after, filterBy, orderBy }, { postsService }) => {
      const query = { where: { author: parent.id } }

      if (!isEmpty(q)) merge(query, { where: { title: { _iLike: q } } })

      merge(query, await queryUtils.buildQuery(filterBy, orderBy, first, last, before, after))

      return postsService.find(query)
    }
  },
  comments: {
    resolve: async (parent, { q, first, last, before, after, filterBy, orderBy }, { commentsService }) => {
      const query = { where: { author: parent.id } }

      if (!isEmpty(q)) merge(query, { where: { text: { _iLike: q } } })

      merge(query, await queryUtils.buildQuery(filterBy, orderBy, first, last, before, after))

      return commentsService.find(query)
    }
  }
}

export default UserGraph
