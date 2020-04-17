import Aigle from 'aigle'
import Dataloader from 'dataloader'

import AbstractCrudService from '../abstract-crud.service'

const { map, find } = Aigle

class PostService extends AbstractCrudService {
  constructor (client, logger) {
    super('PostService', client, logger)

    this._loader = new Dataloader(async (keys) => {
      this._logger.info(`Loading keys from ${this._serviceName}`, keys)
      const { edges } = await this.find({
        where: {
          id: {
            _in: keys
          }
        },
        limit: keys.length
      })

      return map(keys, async (key) => {
        const { node } = await find(edges, async edge => edge.node.id === key)

        return node
      })
    })
  }

  get loader () {
    return this._loader
  }
}

export default PostService
