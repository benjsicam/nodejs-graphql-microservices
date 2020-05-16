import Aigle from 'aigle'
import {
  get, isEmpty, isNil, omitBy, set, unset
} from 'lodash'

const { each, map, omit } = Aigle

class AbstractCrudRepository {
  constructor (model) {
    this._model = model
    this._jsonFields = []
    this._enumFields = []
  }

  async find ({ req, response }) {
    const { results, cursors } = await this._model.findAndPaginate({
      attributes: !isEmpty(req.select) ? ['id'].concat(req.select) : undefined,
      where: !isEmpty(req.where) ? JSON.parse(req.where) : undefined,
      order: !isEmpty(req.orderBy) ? JSON.parse(req.orderBy) : undefined,
      limit: !isNil(req.limit) ? req.limit : 25,
      before: !isEmpty(req.before) ? req.before : undefined,
      after: !isEmpty(req.after) ? req.after : undefined,
      raw: true,
      paranoid: false
    })

    response.res = {
      edges: await map(results, async (result) => {
        const node = omitBy(result, isNil)

        if (!isEmpty(this._jsonFields) && !isEmpty(node)) {
          await each(this._jsonFields, async (field) => {
            if (!isEmpty(get(node, field))) set(node, field, Buffer.from(JSON.stringify(node[field])))
          })
        }

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
    const result = omitBy(await this._model.findByPk(req.id, {
      raw: true
    }), isNil)

    if (!isEmpty(this._jsonFields) && !isEmpty(result)) {
      await each(this._jsonFields, async (field) => {
        if (!isEmpty(get(result, field))) set(result, field, Buffer.from(JSON.stringify(result[field])))
      })
    }

    response.res = result || {}

    return response.res
  }

  async findOne ({ req, response }) {
    const result = omitBy(await this._model.findOne({
      attributes: !isEmpty(req.select) ? req.select : undefined,
      where: !isEmpty(req.where) ? JSON.parse(req.where) : undefined,
      raw: true
    }), isNil)

    if (!isEmpty(this._jsonFields) && !isEmpty(result)) {
      await each(this._jsonFields, async (field) => {
        if (!isEmpty(get(result, field))) set(result, field, Buffer.from(JSON.stringify(result[field])))
      })
    }

    response.res = result || {}

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

    if (!isEmpty(this._jsonFields)) {
      await each(this._jsonFields, async (field) => {
        if (Buffer.isBuffer(get(data, field))) {
          const json = get(data, field).toString()

          if (!isEmpty(json)) set(data, field, JSON.parse(json))
        }
      })
    }

    if (!isEmpty(this._enumFields)) {
      await each(this._enumFields, async (field) => {
        const value = get(data, field)

        if (value === 'UNKNOWN') unset(data, field)
      })
    }

    let result = await this._model.create(data)

    result = omitBy(result.toJSON(), isNil)

    if (!isEmpty(this._jsonFields)) {
      await each(this._jsonFields, async (field) => {
        if (!isEmpty(get(result, field))) set(result, field, Buffer.from(JSON.stringify(result[field])))
      })
    }

    response.res = result

    return response.res
  }

  async update ({ req, response }) {
    const { id, data } = req

    if (!isEmpty(this._jsonFields)) {
      await each(this._jsonFields, async (field) => {
        if (Buffer.isBuffer(get(data, field))) {
          const json = get(data, field).toString()

          if (!isEmpty(json)) set(data, field, JSON.parse(json))
        }
      })
    }

    if (!isEmpty(this._enumFields)) {
      await each(this._enumFields, async (field) => {
        const value = get(data, field)

        if (value === 'UNKNOWN') unset(data, field)
      })
    }

    const model = await this._model.findByPk(id)

    if (isEmpty(model)) throw new Error('Record not found.')

    let result = await model.update(await omit(data, ['id']))

    result = omitBy(result.toJSON(), isNil)

    if (!isEmpty(this._jsonFields)) {
      await each(this._jsonFields, async (field) => {
        if (!isEmpty(get(result, field))) set(result, field, Buffer.from(JSON.stringify(result[field])))
      })
    }

    response.res = result

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
