import { isEmpty } from 'lodash'

const queryUtils = {
  async getOrder (orderBy) {
    let result = []

    if (!isEmpty(orderBy)) {
      if (orderBy.trim().charAt(0) === '-') result = [orderBy.trim().substr(1), 'DESC']
      else result = [orderBy.trim(), 'ASC']
    }

    return result
  }
}

export default queryUtils
