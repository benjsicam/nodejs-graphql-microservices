import Dataloader from 'dataloader'

import AbstractCrudService from '../abstract-crud.service'

class PostService extends AbstractCrudService {
  constructor(client, logger) {
    super('PostService', client, logger)

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
    this._loader
  }
}

export default PostService
