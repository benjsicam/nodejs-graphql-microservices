class AbstractCrudRepository {
  constructor(serviceName, model, logger) {
    this._serviceName = serviceName
    this._model = model
    this._logger = logger
  }

  async findAll({ req, response }) {
    this._logger.info(`${this._serviceName}#findAll.call`, req)

    const query = Buffer.from(req.query)

    const result = await this._model.findAll(
      Object.assign(JSON.parse(query.toString()), {
        raw: true
      })
    )

    this._logger.info(`${this._serviceName}#findAll.result`, { list: result })

    response.res = { list: result }

    return response.res
  }

  async findOne({ req, response }) {
    this._logger.info(`${this._serviceName}#findOne.call`, req)

    const query = Buffer.from(req.query)

    const result = await this._model.findOne(
      Object.assign(JSON.parse(query.toString()), {
        raw: true
      })
    )

    this._logger.info(`${this._serviceName}#findOne.result`, result)

    response.res = result

    return response.res
  }

  async count({ req, response }) {
    this._logger.info(`${this._serviceName}#count.call`, req)

    const query = Buffer.from(req.query)

    const count = await this._model.count(JSON.parse(query.toString()))

    this._logger.info(`${this._serviceName}#count.result`, { count })

    response.res = { count }

    return response.res
  }

  async create({ req, response }) {
    this._logger.info(`${this._serviceName}#create.call`, req)

    const result = await this._model.create(req)

    this._logger.info(`${this._serviceName}#create.result`, result)

    response.res = result

    return response.res
  }

  async update({ req, response }) {
    this._logger.info(`${this._serviceName}#update.call`, req)

    await this._model.update(req.data, {
      where: {
        id: req.id
      }
    })

    const result = await this._model.findOne({
      where: {
        id: req.id
      }
    })

    this._logger.info(`${this._serviceName}#update.result`, result)

    response.res = result

    return response.res
  }

  async destroy({ req, response }) {
    this._logger.info(`${this._serviceName}#destroy.call`, req)

    const count = await this._model.destroy({
      where: {
        id: req.id
      }
    })

    this._logger.info(`${this._serviceName}#destroy.result`, { count })

    response.res = { count }

    return response.res
  }
}

export default AbstractCrudRepository
