import queryUtils from '../../utils/query'
import { get } from 'lodash'

const UserGraph = {
  async posts(parent, args, { postService, logger }) {
    logger.info('UserGraph#posts.call', parent.id)

    const posts = await postService.findAll({
      where: {
        author: parent.id
      },
      limit: await queryUtils.setLimit(get(args, 'limit')),
      offset: await queryUtils.setOffset(get(args, 'page'), get(args, 'limit') || 25),
      order: await queryUtils.parseOrder(get(args, 'orderBy'))
    })

    logger.info('UserGraph#posts.result', posts)

    return posts
  },
  async comments(parent, args, { commentService, logger }) {
    logger.info('UserGraph#comments.call', parent.id)

    const comments = await commentService.findAll({
      where: {
        author: parent.id
      },
      limit: await queryUtils.setLimit(get(args, 'limit')),
      offset: await queryUtils.setOffset(get(args, 'page'), get(args, 'limit') || 25),
      order: await queryUtils.parseOrder(get(args, 'orderBy'))
    })

    logger.info('UserGraph#comments.result', comments)

    return comments
  }
}

export default UserGraph
