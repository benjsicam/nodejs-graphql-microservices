import { isEmpty, merge } from 'lodash'
import queryUtils from '../../utils/query'

const PostGraph = {
  author: {
    resolve: async (parent, args, { usersService }) => usersService.loader.load(parent.author)
  },
  comments: {
    resolve: async (parent, { q, first, last, before, after, filterBy, orderBy }, { commentsService }) => {
      const query = { where: { post: parent.id } }

      if (!isEmpty(q)) merge(query, { where: { text: { _iLike: q } } })

      merge(query, await queryUtils.buildQuery(filterBy, orderBy, first, last, before, after))

      return commentsService.find(query)
    }
  }
}

export { PostGraph as default }
