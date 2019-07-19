class AbstractCrudRepository {
  constructor(serviceName, model, logger) {
    this._serviceName = serviceName
    this._model = model
    this._logger = logger
  }

  findAll({ request }, callback) {
    this._logger.info(`${this._serviceName}#findAll.call`, request)

    this._model
      .findAll(JSON.parse(request.query))
      .then(result => {
        this._logger.info(`${this._serviceName}#findAll.result`, { list: result })

        callback(null, { list: result })
      })
      .catch(err => callback(err))
  }

  findOne({ request }, callback) {
    this._logger.info(`${this._serviceName}#findOne.call`, request)

    this._model
      .findOne(JSON.parse(request.query))
      .then(result => {
        this._logger.info(`${this._serviceName}#findOne.result`, result)

        callback(null, result)
      })
      .catch(err => callback(err))
  }

  count({ request }, callback) {
    this._logger.info(`${this._serviceName}#count.call`, request)

    this._model
      .count(JSON.parse(request.query))
      .then(count => {
        this._logger.info(`${this._serviceName}#count.result`, { count })

        callback(null, { count })
      })
      .catch(err => callback(err))
  }

  create({ request }, callback) {
    this._logger.info(`${this._serviceName}#create.call`, request)

    this._model
      .create(request)
      .then(result => {
        this._logger.info(`${this._serviceName}#create.result`, result)

        callback(null, result)
      })
      .catch(err => callback(err))
  }

  update({ request }, callback) {
    this._logger.info(`${this._serviceName}#update.call`, request)

    this._model
      .update(request.data, {
        where: {
          id: request.id
        }
      })
      .then(() => {
        return this._model.findOne({
          where: {
            id: request.id
          }
        })
      })
      .then(result => {
        this._logger.info(`${this._serviceName}#update.result`, result)

        callback(null, result)
      })
      .catch(err => callback(err))
  }

  destroy({ request }, callback) {
    this._logger.info(`${this._serviceName}#destroy.call`, request)

    this._model
      .destroy({
        where: {
          id: request.id
        }
      })
      .then(count => {
        this._logger.info(`${this._serviceName}#destroy.result`, { count })

        callback(null, { count })
      })
      .catch(err => callback(err))
  }
}

export default AbstractCrudRepository
