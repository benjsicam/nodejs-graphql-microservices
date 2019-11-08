import Dataloader from 'dataloader'

import AbstractCrudService from '../abstract-crud.service'
// import { resolve } from 'dns'

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
      }).then(rows => keys.map(key => rows.find(row => row.id === key)))
    })
  }

  get loader() {
    return this._loader
  }
}

export default PostService
