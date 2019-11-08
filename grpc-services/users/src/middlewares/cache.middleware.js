import crypto from 'crypto'

import { isEmpty } from 'lodash'

class CacheMiddleware {
  constructor(cacheService, logger) {
    this._cacheService = cacheService
    this._logger = logger
  }

  find(prefix) {
    return async ({ req, response }, next) => {
      this._logger.info('CacheMiddleware#find.call')

      const hash = crypto.createHash('sha1')
      const key = hash.update(req.query).digest('hex')

      this._logger.info('CacheMiddleware#find.key', `${prefix}-find-${key}`)

      const cachedResult = await this._cacheService.get(`${prefix}-find-${key}`)

      this._logger.info('CacheMiddleware#find.cachedResult', cachedResult)

      if (!isEmpty(cachedResult)) {
        response.res = cachedResult

        return response.res
      }

      await next()

      this._logger.info('CacheMiddleware#find.addToCache', `${prefix}-find-${key}`, response.res)

      await this._cacheService.set(`${prefix}-find-${key}`, response.res)

      return response.res
    }
  }

  read(prefix) {
    return async ({ req, response }, next) => {
      this._logger.info('CacheMiddleware#read.call')

      const hash = crypto.createHash('sha1')
      const key = hash.update(req.query).digest('hex')

      this._logger.info('CacheMiddleware#read.key', `${prefix}-read-${key}`)

      const cachedResult = await this._cacheService.get(`${prefix}-read-${key}`)

      this._logger.info('CacheMiddleware#read.cachedResult', cachedResult)

      if (!isEmpty(cachedResult)) {
        response.res = cachedResult

        return response.res
      }

      await next()

      this._logger.info('CacheMiddleware#read.addToCache', `${prefix}-read-${key}`, response.res)

      await this._cacheService.set(`${prefix}-read-${key}`, response.res)

      return response.res
    }
  }

  write(prefix) {
    return async (ctx, next) => {
      this._logger.info('CacheMiddleware#write.call')

      await next()

      return this._cacheService.flush(`${prefix}*`)
    }
  }

  remove(prefix) {
    return async ({ response }, next) => {
      this._logger.info('CacheMiddleware#remove.call')

      await next()

      if (response.res.count > 0) {
        return this._cacheService.flush(`${prefix}*`)
      }

      return null
    }
  }
}

export default CacheMiddleware
