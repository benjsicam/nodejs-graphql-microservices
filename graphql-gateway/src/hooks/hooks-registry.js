import { omit } from 'lodash'

import CommentHooks from './comment.hooks'
import UserHooks from './user.hooks'

class HooksRegistry {
  constructor(services, logger) {
    this._eventsBus = services.eventsBus
    this._logger = logger
    this._services = omit(services, ['eventsBus'])
  }

  async register() {
    this._hooks = {
      user: new UserHooks(this._eventsBus, this._services, this._logger),
      comment: new CommentHooks(this._eventsBus, this._services, this._logger)
    }

    return this._hooks
  }

  get hooks() {
    return this._hooks
  }
}

export default HooksRegistry
