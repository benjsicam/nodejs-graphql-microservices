import { isEmpty, isNil } from 'lodash'

const queryUtils = {
  async getFilters(filterBy) {
    const queryFilters = { where: {} }

    if (!isEmpty(filterBy)) Object.assign(queryFilters.where, filterBy)

    return queryFilters
  },
  async getOrder(orderBy) {
    const queryOrder = {}

    if (!isEmpty(orderBy)) {
      if (orderBy.trim().charAt(0) === '-') {
        Object.assign(queryOrder, { orderBy: [orderBy.trim().substr(1), 'DESC'] })
      } else {
        Object.assign(queryOrder, { orderBy: [orderBy.trim(), 'ASC'] })
      }
    }

    return queryOrder
  },
  async getCursor(first, last, before, after) {
    const queryCursor = {}

    if (!isNil(first)) Object.assign(queryCursor, { limit: first })

    if (!isEmpty(after)) {
      Object.assign(queryCursor, { after, limit: first })
    } else if (!isEmpty(before)) {
      Object.assign(queryCursor, { before, limit: last })
    }

    return queryCursor
  },
  async buildQuery(filterBy, orderBy, first, last, before, after) {
    const query = {}

    Object.assign(query, await this.getFilters(filterBy))

    Object.assign(query, await this.getOrder(orderBy))

    Object.assign(query, await this.getCursor(first, last, before, after))

    return query
  }
}

export default queryUtils
