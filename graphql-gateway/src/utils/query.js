import { isNaN, isEmpty } from 'lodash'

const queryUtils = {
    async setLimit(limit) {
        let result = 25

        if (!isNaN(limit) && limit > 0) result = limit

        return result
    },
    async setOffset(page, limit) {
        let result = 0

        if (!isNaN(page) && page > 0) result = (page - 1) * limit

        return result
    },
    async parseOrder(orderBy) {
        let result = [['createdAt', 'DESC']]

        if (!isEmpty(orderBy)) {
            result = []
            let fields = orderBy.split(',')

            fields.forEach(field => {
                if (field.trim().charAt(0) !== '-') {
                    result.push([field.trim(), 'ASC'])
                } else {
                    result.push([field.trim().substr(1), 'DESC'])
                }
            })
          }
        
        return result
    }
}

export default queryUtils