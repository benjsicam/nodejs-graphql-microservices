import Dataloader from 'dataloader'

import AbstractCrudService from '../abstract-crud.service'

class UserService extends AbstractCrudService {
  constructor(client, logger) {
    super('UserService', client, logger)

    this._loader = new Dataloader(async keys => {
      this._logger.info(`Loading keys from ${this._serviceName}`, keys)
      const { results } = await this.find({
        where: {
          id: {
            $in: keys
          }
        },
        limit: keys.length
      })

      return keys.map(key => results.find(row => row.id === key))
    })
  }

  get loader() {
    return this._loader
  }
}

export default UserService
