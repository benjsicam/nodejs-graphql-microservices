class AbstractCrudRepository {
  constructor(model) {
    this._model = model
  }

  async findAll({ req, response }) {
    const query = Buffer.from(req.query)

    const result = await this._model.findAll(
      Object.assign(JSON.parse(query.toString()), {
        raw: true
      })
    )

    response.res = { list: result }

    return response.res
  }

  async findOne({ req, response }) {
    const query = Buffer.from(req.query)

    const result = await this._model.findOne(
      Object.assign(JSON.parse(query.toString()), {
        raw: true
      })
    )

    response.res = result

    return response.res
  }

  async count({ req, response }) {
    const query = Buffer.from(req.query)

    const count = await this._model.count(JSON.parse(query.toString()))

    response.res = { count }

    return response.res
  }

  async create({ req, response }) {
    const result = await this._model.create(req)

    response.res = result

    return response.res
  }

  async update({ req, response }) {
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

    response.res = result

    return response.res
  }

  async destroy({ req, response }) {
    const count = await this._model.destroy({
      where: {
        id: req.id
      }
    })

    response.res = { count }

    return response.res
  }
}

export default AbstractCrudRepository
