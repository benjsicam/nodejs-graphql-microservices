import Redis from 'ioredis'
import faker from 'faker'

import logger from '../src/logger'
import CacheService from '../src/services/cache.service'
import CacheMiddleware from '../src/middlewares/cache.middleware'

const PREFIX = 'test'

describe('Cache Testing', () => {
  let redis
  let redisConnOpts
  let cacheService
  let cacheMiddleware

  beforeAll(async () => {
    logger.info('=====SETUP====')
    redisConnOpts = {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    }
    redis = new Redis(redisConnOpts)
    cacheService = new CacheService(redis, logger)
    cacheMiddleware = new CacheMiddleware(cacheService, logger)
  })

  afterAll(async () => {
    logger.info('=====TEARDOWN====')
    return redis.disconnect()
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
          res: [
            {
              id: faker.random.uuid(),
              text: faker.random.alphaNumeric(24),
              post: faker.random.uuid(),
              author: faker.random.uuid()
            },
            {
              id: faker.random.uuid(),
              text: faker.random.alphaNumeric(24),
              post: faker.random.uuid(),
              author: faker.random.uuid()
            },
            {
              id: faker.random.uuid(),
              text: faker.random.alphaNumeric(24),
              post: faker.random.uuid(),
              author: faker.random.uuid()
            }
          ]
        }
      }

      const result = await cacheMiddleware.find(PREFIX)(args, () => true)

      // Stucture check/s
      expect(result[0]).toContainAllKeys(['id', 'text', 'post', 'author'])

      // Type check/s
      expect(result).toBeArray()
      expect(result[0].id).toBeString()
      expect(result[0].text).toBeString()
      expect(result[0].post).toBeString()
      expect(result[0].author).toBeString()

      // Value check/s
      expect(result).toBeArrayOfSize(3)
      expect(result).toIncludeSameMembers(args.response.res)
    })

    it('#should grab from cache on find', async () => {
      const args = {
        req: {
          query: JSON.stringify({
            q: faker.random.alphaNumeric(12)
          })
        },
        response: {
          res: [
            {
              id: faker.random.uuid(),
              text: faker.random.alphaNumeric(24),
              post: faker.random.uuid(),
              author: faker.random.uuid()
            },
            {
              id: faker.random.uuid(),
              text: faker.random.alphaNumeric(24),
              post: faker.random.uuid(),
              author: faker.random.uuid()
            },
            {
              id: faker.random.uuid(),
              text: faker.random.alphaNumeric(24),
              post: faker.random.uuid(),
              author: faker.random.uuid()
            }
          ]
        }
      }

      await cacheMiddleware.find(PREFIX)(args, () => true)

      const result = await cacheMiddleware.find(PREFIX)(args, () => true)

      // Stucture check/s
      expect(result[0]).toContainAllKeys(['id', 'text', 'post', 'author'])

      // Type check/s
      expect(result).toBeArray()
      expect(result[0].id).toBeString()
      expect(result[0].text).toBeString()
      expect(result[0].post).toBeString()
      expect(result[0].author).toBeString()

      // Value check/s
      expect(result).toBeArrayOfSize(3)
      expect(result).toIncludeSameMembers(args.response.res)
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
      expect(result).toContainAllKeys(['id', 'text', 'post', 'author'])

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
    })

    it('#should cache result on read 2', async () => {
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
      expect(result).toContainAllKeys(['id', 'text', 'post', 'author'])

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

      const key = Buffer.from(JSON.stringify(args.req)).toString('base64')
      let cachedResult = await cacheService.get(`${PREFIX}-read-${key}`)

      expect(cachedResult).not.toBeNil()

      await cacheMiddleware.write(PREFIX)({}, () => true)

      cachedResult = await cacheService.get(`${PREFIX}-read-${key}`)

      expect(cachedResult).toBeNil()
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

      const key = Buffer.from(JSON.stringify(args.req)).toString('base64')
      let cachedResult = await cacheService.get(`${PREFIX}-read-${key}`)

      expect(cachedResult).not.toBeNil()

      await cacheMiddleware.remove(PREFIX)(
        {
          response: {
            res: { count: 1 }
          }
        },
        () => true
      )

      cachedResult = await cacheService.get(`${PREFIX}-read-${key}`)

      expect(cachedResult).toBeNil()
    })

    it('#should return nil when 0 count on remove', async () => {
      const result = await cacheMiddleware.remove(PREFIX)(
        {
          response: {
            res: { count: 0 }
          }
        },
        () => true
      )

      expect(result).toBeNil()
    })
  })
})
