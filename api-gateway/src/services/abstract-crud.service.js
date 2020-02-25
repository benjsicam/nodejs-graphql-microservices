import Aigle from 'aigle'

import { isEmpty } from 'lodash'

class AbstractCrudService {
  constructor(serviceName, client, logger) {
    this._serviceName = serviceName
    this._client = Aigle.promisifyAll(client)
    this._logger = logger
  }

  async find(query) {
    this._logger.info(`${this._serviceName}#find.call`, query)

    const result = await this._client.findAsync({
      select: !isEmpty(query.select) ? query.select : undefined,
      where: !isEmpty(query.where) ? JSON.stringify(query.where) : undefined,
      orderBy: !isEmpty(query.orderBy) ? JSON.stringify(query.orderBy) : undefined,
      limit: query.limit ? query.limit : 25,
      before: !isEmpty(query.before) ? query.before : undefined,
      after: !isEmpty(query.after) ? query.after : undefined
    })

    this._logger.info(`${this._serviceName}#find.result`, result)

    return result
  }

  async findById(query) {
    this._logger.info(`${this._serviceName}#findById.call`, query)

    const result = await this._client.findByIdAsync({
      select: !isEmpty(query.select) ? query.select : undefined,
      where: !isEmpty(query.where) ? JSON.stringify(query.where) : undefined
    })

    this._logger.info(`${this._serviceName}#findById.result`, result)

    return result
  }

  async findOne(query) {
    this._logger.info(`${this._serviceName}#findOne.call`, query)

    const result = await this._client.findOneAsync({
      select: !isEmpty(query.select) ? query.select : undefined,
      where: !isEmpty(query.where) ? JSON.stringify(query.where) : undefined
    })

    this._logger.info(`${this._serviceName}#findOne.result`, result)

    return result
  }

  async count(query) {
    this._logger.info(`${this._serviceName}#count.call`, query)

    const result = await this._client.countAsync({
      where: !isEmpty(query.where) ? JSON.stringify(query.where) : undefined
    })

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

  async destroy(query) {
    this._logger.info(`${this._serviceName}#destroy.call`, query)

    const result = await this._client.destroyAsync({
      where: !isEmpty(query.where) ? JSON.stringify(query.where) : undefined
    })

    this._logger.info(`${this._serviceName}#destroy.result`, result)

    return result.count
  }
}

export default AbstractCrudService
