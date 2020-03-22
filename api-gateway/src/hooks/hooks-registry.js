import CommentHooks from './comment.hooks'
import PostHooks from './post.hooks'
import UserHooks from './user.hooks'

class HooksRegistry {
  constructor(services, pubsub, logger) {
    this._hooks = {
      comment: new CommentHooks(services, pubsub, logger),
      post: new PostHooks(services, pubsub, logger),
      user: new UserHooks(services, pubsub, logger),
    }
  }

  get hooks() {
    return this._hooks
  }
}

export default HooksRegistry
