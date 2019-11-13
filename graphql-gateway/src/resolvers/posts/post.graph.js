import { get } from 'lodash'
import queryUtils from '../../utils/query'

const PostGraph = {
  async author(parent, args, { userService, logger }) {
    logger.info('PostGraph#author.call', parent.author)

    const user = await userService.loader.load(parent.author)

    logger.info('PostGraph#author.result', user)

    return user
  },
  async comments(parent, args, { commentService, logger }) {
    logger.info('PostGraph#comments.call', args)

    const limit = await queryUtils.getLimit(get(args, 'limit'))
    const offset = await queryUtils.getOffset(get(args, 'page'), get(args, 'limit') || 25)
    const order = await queryUtils.getOrder(get(args, 'orderBy'))

    const comments = await commentService.findAll({
      where: {
        post: parent.id
      },
      limit,
      offset,
      order 
    })

    logger.info('PostGraph#comments.result', comments)

    return comments
  }
}

export { PostGraph as default }
