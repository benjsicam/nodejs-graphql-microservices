import { isArray } from 'lodash'

const errorUtils = {
  buildError(message) {
    if (!isArray(message)) {
      throw new Error('Invalid error message.')
    } else {
      return {
        errors: [
          {
            message
          }
        ]
      }
    }
  }
}

export default errorUtils
