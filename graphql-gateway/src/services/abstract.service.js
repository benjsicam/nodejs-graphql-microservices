class AbstractService {
  constructor(serviceName, client, logger) {
    this._serviceName = serviceName
    this._client = client
    this._logger = logger
  }

  async findAll(query) {
    this._logger.info(`${this._serviceName}#findAll.call`, query)

    return this._client.findAll({ query }).then(result => {
      this._logger.info(`${this._serviceName}#findAll.result`, result)

      return result.list
    })
  }

  async findOne(query) {
    this._logger.info(`${this._serviceName}#findOne.call`, query)

    return this._client.findOne({ query }).then(result => {
      this._logger.info(`${this._serviceName}#findOne.result`, result)

      return result
    })
  }

  async count(query) {
    this._logger.info(`${this._serviceName}#count.call`, query)

    return this._client.count({ query }).then(result => {
      this._logger.info(`${this._serviceName}#count.result`, result)

      return result.count
    })
  }

  async create(data) {
    this._logger.info(`${this._serviceName}#create.call`, data)

    return this._client.create(data).then(result => {
      this._logger.info(`${this._serviceName}#create.result`, result)

      return result
    })
  }

  async update(id, data) {
    this._logger.info(`${this._serviceName}#update.call`, { id, data })

    return this._client.update({ id, data }).then(result => {
      this._logger.info(`${this._serviceName}#update.result`, result)

      return result
    })
  }

  async destroy(id) {
    this._logger.info(`${this._serviceName}#destroy.call`, id)

    return this._client.destroy({ id })
  }
}

export default AbstractService
