import { get } from 'lodash'
import queryUtils from '../../utils/query'

const UserGraph = {
  async posts(parent, args, { postService, logger }) {
    logger.info('UserGraph#posts.call', parent.id)

    const limit = await queryUtils.getLimit(get(args, 'limit'))
    const offset = await queryUtils.getOffset(get(args, 'page'), get(args, 'limit') || 25)
    const order = await queryUtils.getOrder(get(args, 'orderBy'))

    const posts = await postService.findAll({
      where: {
        author: parent.id
      },
      limit,
      offset,
      order 
    })

    logger.info('UserGraph#posts.result', posts)

    return posts
  },
  async comments(parent, args, { commentService, logger }) {
    logger.info('UserGraph#comments.call', parent.id)

    const limit = await queryUtils.getLimit(get(args, 'limit'))
    const offset = await queryUtils.getOffset(get(args, 'page'), get(args, 'limit') || 25)
    const order = await queryUtils.getOrder(get(args, 'orderBy'))

    const comments = await commentService.findAll({
      where: {
        author: parent.id
      },
      limit,
      offset,
      order 
    })

    logger.info('UserGraph#comments.result', comments)

    return comments
  }
}

export default UserGraph
