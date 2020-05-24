import CommentHooks from './comment.hooks'
import UserHooks from './user.hooks'

class HooksRegistry {
  constructor(services, logger) {
    this._services = services
    this._logger = logger
  }

  async init() {
    this._hooks = {
      comment: new CommentHooks(this._services, this._logger),
      user: new UserHooks(this._services, this._logger)
    }
  }

  get hooks() {
    return this._hooks
  }
}

export default HooksRegistry
