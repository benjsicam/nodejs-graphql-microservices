import AbstractService from '../abstract.service'

class UserService extends AbstractService {
  constructor(client, logger) {
    super('UserService', client, logger)
  }

  async findAll(query) {
    this._logger.info(`${this._serviceName}#findAll.call`, query)

    return this._client.findAll({ query }).then(result => {
      this._logger.info(`${this._serviceName}#findAll.result`, result)

      return result.usersList
    })
  }
}

export default UserService
