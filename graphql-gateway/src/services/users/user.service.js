import Dataloader from 'dataloader'

import AbstractCrudService from '../abstract-crud.service'

class UserService extends AbstractCrudService {
  constructor(client, logger) {
    super('UserService', client, logger)

    this._loader = new Dataloader(keys => {
      this._logger.info(`Loading keys from ${this._serviceName}`, keys)
      return this.findAll({
        where: {
          id: {
            $in: keys
          }
        }
      })
    })
  }

  get loader() {
    return this._loader
  }
}

export default UserService
