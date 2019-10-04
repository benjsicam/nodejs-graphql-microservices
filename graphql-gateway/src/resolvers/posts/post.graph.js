import queryUtils from '../../utils/query'
import { get } from 'lodash'

const PostGraph = {
  async author(parent, args, { userService, logger }) {
    logger.info('PostGraph#author.call', parent.author)

    const user = await userService.findOne({
      where: {
        id: parent.author
      }
    })

    logger.info('PostGraph#author.result', user)

    return user
  },
  async comments(parent, args, { commentService, logger }) {
    logger.info('PostGraph#comments.call', args)

    const comments = await commentService.findAll({
      where: {
        post: parent.id
      },
      limit: await queryUtils.setLimit(get(args, 'limit')),
      offset: await queryUtils.setOffset(get(args, 'page'), get(args, 'limit') || 25),
      order: await queryUtils.parseOrder(get(args, 'orderBy'))
    })

    logger.info('PostGraph#comments.result', comments)

    return comments
  }
}

export { PostGraph as default }
