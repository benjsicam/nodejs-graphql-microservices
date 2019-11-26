class RedisCacheService {
  constructor(cache, logger) {
    this._cache = cache
    this._logger = logger
  }

  async get(key) {
    this._logger.info('Cache#get.call', key)

    let result = await this._cache.get(key)

    this._logger.info('Cache#get.result', result)

    try {
      result = JSON.parse(result)

      return result
    } catch {
      /* istanbul ignore next */
      return result
    }
  }

  async set(key, value) {
    this._logger.info('Cache#set.call', key, value)

    let val

    try {
      val = JSON.stringify(value)
    } catch {
      /* istanbul ignore next */
      val = ''
    }

    return this._cache.set(key, val)
  }

  async remove(key) {
    this._logger.info('Cache#remove.call', key)

    return this._cache.del(key)
  }

  async flush(pattern) {
    this._logger.info('Cache#flush.call', pattern)

    return new Promise((resolve, reject) => {
      const stream = this._cache.scanStream({
        match: pattern,
        count: 99999
      })
      const pipeline = this._cache.pipeline()

      stream.on('data', keys => {
        this._logger.info('Cache#flush.keys', keys.join(', '))

        keys.forEach(key => {
          pipeline.del(key)
        })
      })

      stream.on('end', () => {
        pipeline.exec()
        resolve()
      })

      stream.on('error', err => {
        /* istanbul ignore next */
        reject(err)
      })
    })
  }
}

export default RedisCacheService
