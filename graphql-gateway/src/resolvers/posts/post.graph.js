import { get } from 'lodash'
import queryUtils from '../../utils/query'

const PostGraph = {
  author: {
    resolve: async (parent, args, { userService }) => {
      return userService.loader.load(parent.author)
    }
  },
  comments: {
    resolve: async (parent, args, { commentService }) => {
      const limit = await queryUtils.getLimit(get(args, 'limit'))
      const offset = await queryUtils.getOffset(get(args, 'page'), get(args, 'limit') || 25)
      const order = await queryUtils.getOrder(get(args, 'orderBy'))

      return commentService.findAll({
        where: {
          post: parent.id
        },
        limit,
        offset,
        order
      })
    }
  }
}

export { PostGraph as default }
