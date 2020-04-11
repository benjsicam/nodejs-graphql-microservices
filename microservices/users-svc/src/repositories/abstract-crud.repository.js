import Aigle from 'aigle'
import { isEmpty, isNil } from 'lodash'

const { each, map, omit } = Aigle

class AbstractCrudRepository {
  constructor (model) {
    this._model = model
    this._jsonFields = []
  }

  async find ({ req, response }) {
    const { results, cursors } = await this._model.findAndPaginate({
      attributes: !isEmpty(req.select) ? req.select : undefined,
      where: !isEmpty(req.where) ? JSON.parse(req.where) : undefined,
      order: !isEmpty(req.orderBy) ? JSON.parse(req.orderBy) : undefined,
      limit: !isNil(req.limit) ? req.limit : 25,
      before: !isEmpty(req.before) ? req.before : undefined,
      after: !isEmpty(req.after) ? req.after : undefined,
      raw: false,
      paranoid: false
    })

    response.res = {
      edges: await map(results, async (result) => {
        const node = result.toJSON()

        await each(this._jsonFields, async (field) => {
          if (!isEmpty(node[field])) node[field] = Buffer.from(JSON.stringify(node[field]))
        })

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

  async findById ({ req, response }) {
    let result = await this._model.findByPk(req.id)

    result = !isEmpty(result) ? result.toJSON() : {}

    await each(this._jsonFields, async (field) => {
      if (!isEmpty(result[field])) result[field] = Buffer.from(JSON.stringify(result[field]))
    })

    response.res = result

    return response.res
  }

  async findOne ({ req, response }) {
    let result = await this._model.findOne({
      attributes: !isEmpty(req.select) ? req.select : undefined,
      where: !isEmpty(req.where) ? JSON.parse(req.where) : undefined
    })

    result = !isEmpty(result) ? result.toJSON() : {}

    await each(this._jsonFields, async (field) => {
      if (!isEmpty(result[field])) result[field] = Buffer.from(JSON.stringify(result[field]))
    })

    response.res = result

    return response.res
  }

  async count ({ req, response }) {
    const count = await this._model.count({
      where: !isEmpty(req.where) ? JSON.parse(req.where) : undefined
    })

    response.res = { count }

    return response.res
  }

  async create ({ req, response }) {
    const data = req

    await each(this._jsonFields, async (field) => {
      if (Buffer.isBuffer(data[field])) {
        const json = data[field].toString()

        if (!isEmpty(json)) data[field] = JSON.parse(json)
      }
    })

    const result = await this._model.create(data)

    await each(this._jsonFields, async (field) => {
      if (!isEmpty(result[field])) result[field] = Buffer.from(JSON.stringify(result[field]))
    })

    response.res = result.toJSON()

    return response.res
  }

  async update ({ req, response }) {
    const { id, data } = req

    await each(this._jsonFields, async (field) => {
      if (Buffer.isBuffer(data[field])) {
        const json = data[field].toString()

        if (!isEmpty(json)) data[field] = JSON.parse(json)
      }
    })

    const model = await this._model.findByPk(id)

    if (isEmpty(model)) throw new Error('Record not found.')

    model.set(await omit(data, ['id']))

    const result = await model.save()

    await each(this._jsonFields, async (field) => {
      if (!isEmpty(result[field])) result[field] = Buffer.from(JSON.stringify(result[field]))
    })

    response.res = result.toJSON()

    return response.res
  }

  async destroy ({ req, response }) {
    const count = await this._model.destroy({
      where: !isEmpty(req.where) ? JSON.parse(req.where) : {}
    })

    response.res = { count }

    return response.res
  }
}

export default AbstractCrudRepository
