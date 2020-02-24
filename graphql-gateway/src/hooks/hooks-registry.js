import CommentHooks from './comment.hooks'
import PostHooks from './post.hooks'
import UserHooks from './user.hooks'

class HooksRegistry {
  constructor(services, pubsub, logger) {
    this._services = services
    this._pubsub = pubsub
    this._logger = logger
  }

  async register() {
    this._hooks = {
      comment: new CommentHooks(this._services, this._pubsub, this._logger),
      post: new PostHooks(this._services, this._pubsub, this._logger),
      user: new UserHooks(this._services, this._pubsub, this._logger)
    }

    return this._hooks
  }

  get hooks() {
    return this._hooks
  }
}

export default HooksRegistry
