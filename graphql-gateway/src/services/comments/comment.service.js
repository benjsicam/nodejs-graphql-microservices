import AbstractService from '../abstract.service'

class CommentService extends AbstractService {
  constructor(client, logger) {
    super('CommentService', client, logger)
  }

  async findAll(query) {
    this._logger.info(`${this._serviceName}#findAll.call`, query)

    return this._client.findAll({ query }).then(result => {
      this._logger.info(`${this._serviceName}#findAll.result`, result)

      return result.commentsList
    })
  }
}

export default CommentService
