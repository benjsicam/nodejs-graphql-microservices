import { isEmpty, merge } from 'lodash'
import queryUtils from '../../utils/query'

const PostGraph = {
  author: {
    resolve: async (parent, args, { userService }) => userService.loader.load(parent.author)
  },
  comments: {
    resolve: async (parent, {
      q, first, last, before, after, filterBy, orderBy
    }, { commentService }) => {
      const query = { where: { post: parent.id } }

      if (!isEmpty(q)) merge(query, { where: { text: { _iLike: q } } })

      merge(query, await queryUtils.buildQuery(filterBy, orderBy, first, last, before, after))

      return commentService.find(query)
    }
  }
}

export { PostGraph as default }
