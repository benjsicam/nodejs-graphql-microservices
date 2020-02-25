import Aigle from 'aigle'
import { isEmpty, isNil } from 'lodash'

class AbstractCrudRepository {
  constructor(model) {
    this._model = model
  }

  async find({ req, response }) {
    const { results, cursors } = await this._model.findAndPaginate({
      attributes: !isEmpty(req.select) ? req.select : undefined,
      where: !isEmpty(req.where) ? JSON.parse(req.where) : undefined,
      order: !isEmpty(req.orderBy) ? JSON.parse(req.orderBy) : undefined,
      limit: !isNil(req.limit) ? req.limit : 25,
      before: !isEmpty(req.before) ? req.before : undefined,
      after: !isEmpty(req.after) ? req.after : undefined,
      raw: true,
      paranoid: false
    })

    response.res = {
      edges: await Aigle.map(results, async node => {
        return {
          node,
          cursor: Buffer.from(JSON.stringify([node.id])).toString('base64')
        }
      }),
      pageInfo: {
        startCursor: cursors.before || '',
        endCursor: cursors.after || '',
        hasNextPage: cursors.hasNext || false,
        hasPreviousPage: cursors.hasPrevious || false
      }
    }

    return response.res
  }

  async findById({ req, response }) {
    const result = await this._model.findByPk(req.id)

    response.res = result

    return response.res
  }

  async findOne({ req, response }) {
    const result = await this._model.findOne({
      attributes: !isEmpty(req.select) ? req.select : undefined,
      where: !isEmpty(req.where) ? JSON.parse(req.where) : undefined,
      raw: true
    })

    response.res = result

    return response.res
  }

  async count({ req, response }) {
    const count = await this._model.count({
      where: !isEmpty(req.where) ? JSON.parse(req.where) : undefined
    })

    response.res = { count }

    return response.res
  }

  async create({ req, response }) {
    const result = await this._model.create(req)

    response.res = result

    return response.res
  }

  async update({ req, response }) {
    const model = await this._model.findOne({
      where: {
        id: req.id
      }
    })

    model.set(req.data)

    const result = await model.save()

    response.res = result

    return response.res
  }

  async destroy({ req, response }) {
    const count = await this._model.destroy({
      where: !isEmpty(req.where) ? JSON.parse(req.where) : undefined
    })

    response.res = { count }

    return response.res
  }
}

export default AbstractCrudRepository
