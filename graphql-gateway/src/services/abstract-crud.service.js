import Aigle from 'aigle'

class AbstractCrudService {
  constructor(serviceName, client, logger) {
    this._serviceName = serviceName
    this._client = Aigle.promisifyAll(client)
    this._logger = logger
  }

  async findAll(query) {
    this._logger.info(`${this._serviceName}#findAll.call`, { query })

    const result = await this._client.findAllAsync({ query: Buffer.from(JSON.stringify(query || {})) })

    this._logger.info(`${this._serviceName}#findAll.result`, result)

    return result.list
  }

  async findOne(query) {
    this._logger.info(`${this._serviceName}#findOne.call`, { query })

    const result = await this._client.findOneAsync({ query: Buffer.from(JSON.stringify(query || {})) })

    this._logger.info(`${this._serviceName}#findOne.result`, result)

    return result
  }

  async count(query) {
    this._logger.info(`${this._serviceName}#count.call`, { query })

    const result = await this._client.countAsync({ query: Buffer.from(JSON.stringify(query || {})) })

    this._logger.info(`${this._serviceName}#count.result`, result)

    return result.count
  }

  async create(data) {
    this._logger.info(`${this._serviceName}#create.call`, data)

    const result = await this._client.createAsync(data)

    this._logger.info(`${this._serviceName}#create.result`, result)

    return result
  }

  async update(id, data) {
    this._logger.info(`${this._serviceName}#update.call`, { id, data })

    const result = await this._client.updateAsync({ id, data })

    this._logger.info(`${this._serviceName}#update.result`, result)

    return result
  }

  async destroy(id) {
    this._logger.info(`${this._serviceName}#destroy.call`, id)

    const result = await this._client.destroyAsync({ id })

    this._logger.info(`${this._serviceName}#destroy.result`, result)

    return result.count
  }
}

export default AbstractCrudService
