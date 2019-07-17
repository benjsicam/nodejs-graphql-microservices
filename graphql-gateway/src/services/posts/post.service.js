import AbstractService from '../abstract.service'

class PostService extends AbstractService {
  constructor(client, logger) {
    super('PostService', client, logger)
  }

  async findAll(query) {
    this._logger.info(`${this._serviceName}#findAll.call`, query)

    return this._client.findAll({ query }).then(result => {
      this._logger.info(`${this._serviceName}#findAll.result`, result)

      return result.postsList
    })
  }
}

export default PostService
