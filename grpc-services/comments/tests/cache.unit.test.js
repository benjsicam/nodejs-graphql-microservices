import crypto from 'crypto'
import Redis from 'ioredis'
import faker from 'faker'

import logger from '../src/logger'
import CacheService from '../src/services/cache.service'
import CacheMiddleware from '../src/middlewares/cache.middleware'

const PREFIX = 'test'

describe('Cache Testing', () => {
  let redis, redisConnOpts, cacheService, cacheMiddleware

  beforeAll(async () => {
    logger.info('=====SETUP====')
    redisConnOpts = {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    }
    redis = new Redis(redisConnOpts)
    cacheService = new CacheService(redis, logger)
    cacheMiddleware = new CacheMiddleware(cacheService, logger)

    return
  })

  afterAll(async () => {
    logger.info('=====TEARDOWN====')
    return redis.quit()
  })

  describe('CacheService', () => {
    it('#should cache values on set ', async () => {
      let key = faker.random.alphaNumeric(24)
      let data = {
        text: faker.random.alphaNumeric(24),
        post: faker.random.uuid(),
        author: faker.random.uuid()
      }

      const setResult = await cacheService.set(key, data)

      expect(setResult).toBe('OK')

      const res = await cacheService.get(key)

      // Stucture check/s
      expect(res).toContainAllKeys([
        'text',
        'post',
        'author'
      ])

      // Type check/s
      expect(res.text).toBeString()
      expect(res.post).toBeString()
      expect(res.author).toBeString()

      // Value check/s
      expect(res.text).toBe(data.text)
      expect(res.post).toBe(data.post)
      expect(res.author).toBe(data.author)

      return
    })

    it('#should remove a single entry on remove ', async () => {
      let key = faker.random.alphaNumeric(24)
      let data = {
        text: faker.random.alphaNumeric(24),
        post: faker.random.uuid(),
        author: faker.random.uuid()
      }

      const setResult = await cacheService.set(key, data)

      expect(setResult).toBe('OK')

      await cacheService.remove(key)

      const res = await cacheService.get(key)

      expect(res).toBeNil()

      return
    })

    it('#should remove multiple entries on flush pattern', async () => {
      const key1 = `test-${faker.random.alphaNumeric(24)}`
      const data1 = {
        text: faker.random.alphaNumeric(24),
        post: faker.random.uuid(),
        author: faker.random.uuid()
      }

      const key2 = `test-${faker.random.alphaNumeric(24)}`
      const data2 = {
        text: faker.random.alphaNumeric(24),
        post: faker.random.uuid(),
        author: faker.random.uuid()
      }

      const setResult1 = await cacheService.set(key1, data1)
      const setResult2 = await cacheService.set(key2, data2)

      expect(setResult1).toBe('OK')
      expect(setResult2).toBe('OK')

      await cacheService.flush('test*')

      const res1 = await cacheService.get(key1)
      const res2 = await cacheService.get(key2)

      expect(res1).toBeNil()
      expect(res2).toBeNil()

      return
    })
  })

  describe('CacheMiddleware', () => {
    it('#should add to cache on find', async () => {
      const args = {
        req: {
          query: JSON.stringify({
            q: faker.random.alphaNumeric(12)
          })
        },
        response: {
          res: [{
            id: faker.random.uuid(),
            text: faker.random.alphaNumeric(24),
            post: faker.random.uuid(),
            author: faker.random.uuid()
          }, {
            id: faker.random.uuid(),
            text: faker.random.alphaNumeric(24),
            post: faker.random.uuid(),
            author: faker.random.uuid()
          }, {
            id: faker.random.uuid(),
            text: faker.random.alphaNumeric(24),
            post: faker.random.uuid(),
            author: faker.random.uuid()
          }]
        }
      }

      const result = await cacheMiddleware.find(PREFIX)(args, () => true)

      // Stucture check/s
      expect(result[0]).toContainAllKeys([
        'id',
        'text',
        'post',
        'author'
      ])

      // Type check/s
      expect(result).toBeArray()
      expect(result[0].id).toBeString()
      expect(result[0].text).toBeString()
      expect(result[0].post).toBeString()
      expect(result[0].author).toBeString()

      // Value check/s
      expect(result).toBeArrayOfSize(3)
      expect(result).toIncludeSameMembers(args.response.res)

      return
    })

    it('#should grab from cache on find', async () => {
      const args = {
        req: {
          query: JSON.stringify({
            q: faker.random.alphaNumeric(12)
          })
        },
        response: {
          res: [{
            id: faker.random.uuid(),
            text: faker.random.alphaNumeric(24),
            post: faker.random.uuid(),
            author: faker.random.uuid()
          }, {
            id: faker.random.uuid(),
            text: faker.random.alphaNumeric(24),
            post: faker.random.uuid(),
            author: faker.random.uuid()
          }, {
            id: faker.random.uuid(),
            text: faker.random.alphaNumeric(24),
            post: faker.random.uuid(),
            author: faker.random.uuid()
          }]
        }
      }

      await cacheMiddleware.find(PREFIX)(args, () => true)

      const result = await cacheMiddleware.find(PREFIX)(args, () => true)

      // Stucture check/s
      expect(result[0]).toContainAllKeys([
        'id',
        'text',
        'post',
        'author'
      ])

      // Type check/s
      expect(result).toBeArray()
      expect(result[0].id).toBeString()
      expect(result[0].text).toBeString()
      expect(result[0].post).toBeString()
      expect(result[0].author).toBeString()

      // Value check/s
      expect(result).toBeArrayOfSize(3)
      expect(result).toIncludeSameMembers(args.response.res)

      return
    })

    it('#should cache result on read ', async () => {
      const id = faker.random.uuid()
      const args = {
        req: {
          query: JSON.stringify({
            where: {
              id
            }
          })
        },
        response: {
          res: {
            id,
            text: faker.random.alphaNumeric(24),
            post: faker.random.uuid(),
            author: faker.random.uuid()
          }
        }
      }

      const result = await cacheMiddleware.read(PREFIX)(args, () => true)

      // Stucture check/s
      expect(result).toContainAllKeys([
        'id',
        'text',
        'post',
        'author'
      ])

      // Type check/s
      expect(result.id).toBeString()
      expect(result.text).toBeString()
      expect(result.post).toBeString()
      expect(result.author).toBeString()

      // Value check/s
      expect(result.id).toBe(id)
      expect(result.text).toBe(args.response.res.text)
      expect(result.post).toBe(args.response.res.post)
      expect(result.author).toBe(args.response.res.author)

      return
    })

    it('#should cache result on read ', async () => {
      const id = faker.random.uuid()
      const args = {
        req: {
          query: JSON.stringify({
            where: {
              id
            }
          })
        },
        response: {
          res: {
            id,
            text: faker.random.alphaNumeric(24),
            post: faker.random.uuid(),
            author: faker.random.uuid()
          }
        }
      }

      await cacheMiddleware.read(PREFIX)(args, () => true)

      const result = await cacheMiddleware.read(PREFIX)(args, () => true)

      // Stucture check/s
      expect(result).toContainAllKeys([
        'id',
        'text',
        'post',
        'author'
      ])

      // Type check/s
      expect(result.id).toBeString()
      expect(result.text).toBeString()
      expect(result.post).toBeString()
      expect(result.author).toBeString()

      // Value check/s
      expect(result.id).toBe(id)
      expect(result.text).toBe(args.response.res.text)
      expect(result.post).toBe(args.response.res.post)
      expect(result.author).toBe(args.response.res.author)

      return
    })

    it('#should flush cache on write', async () => {
      const id = faker.random.uuid()
      const args = {
        req: {
          query: JSON.stringify({
            where: {
              id
            }
          })
        },
        response: {
          res: {
            id,
            text: faker.random.alphaNumeric(24),
            post: faker.random.uuid(),
            author: faker.random.uuid()
          }
        }
      }

      await cacheMiddleware.read(PREFIX)(args, () => true)

      const hash = crypto.createHash('sha1')
      const key = hash.update(args.req.query).digest('hex')
      let cachedResult = await cacheService.get(`${PREFIX}-read-${key}`)

      expect(cachedResult).not.toBeNil()

      await cacheMiddleware.write(PREFIX)({}, () => true)

      cachedResult = await cacheService.get(`${PREFIX}-read-${key}`)

      expect(cachedResult).toBeNil()

      return
    })

    it('#should flush cache on remove', async () => {
      const id = faker.random.uuid()
      const args = {
        req: {
          query: JSON.stringify({
            where: {
              id
            }
          })
        },
        response: {
          res: {
            id,
            text: faker.random.alphaNumeric(24),
            post: faker.random.uuid(),
            author: faker.random.uuid()
          }
        }
      }

      await cacheMiddleware.read(PREFIX)(args, () => true)

      const hash = crypto.createHash('sha1')
      const key = hash.update(args.req.query).digest('hex')
      let cachedResult = await cacheService.get(`${PREFIX}-read-${key}`)

      expect(cachedResult).not.toBeNil()

      await cacheMiddleware.remove(PREFIX)({
        response: {
          res: { count: 1 }
        }
      }, () => true)

      cachedResult = await cacheService.get(`${PREFIX}-read-${key}`)

      expect(cachedResult).toBeNil()

      return
    })

    it('#should return nil when 0 count on remove', async () => {
      const result = await cacheMiddleware.remove(PREFIX)({
        response: {
          res: { count: 0 }
        }
      }, () => true)

      expect(result).toBeNil()

      return
    })
  })
})
