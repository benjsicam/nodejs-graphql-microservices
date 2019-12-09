import { get } from 'lodash'
import queryUtils from '../../utils/query'

const UserGraph = {
  posts: {
    resolve: async (parent, args, { postService }) => {
      const limit = await queryUtils.getLimit(get(args, 'limit'))
      const offset = await queryUtils.getOffset(get(args, 'page'), get(args, 'limit') || 25)
      const order = await queryUtils.getOrder(get(args, 'orderBy'))

      return postService.findAll({
        where: {
          author: parent.id
        },
        limit,
        offset,
        order
      })
    }
  },
  comments: {
    resolve: async (parent, args, { commentService }) => {
      const limit = await queryUtils.getLimit(get(args, 'limit'))
      const offset = await queryUtils.getOffset(get(args, 'page'), get(args, 'limit') || 25)
      const order = await queryUtils.getOrder(get(args, 'orderBy'))

      return commentService.findAll({
        where: {
          author: parent.id
        },
        limit,
        offset,
        order
      })
    }
  }
}

export default UserGraph
