import path from 'path'
import glob from 'glob'
import faker from 'faker'

import { map } from 'lodash'

import Db from '../src/db'
import logger from '../src/logger'
import CommentRepository from '../src/repositories/comment.repository'

const MODEL_NAME = 'comment'
const SERVICE_NAME = 'CommentService'

describe('Database Testing', () => {
  let db, repo

  const generateMockData = async (isSingle = false) => {
    if (isSingle) {
      return {
        text: faker.random.alphaNumeric(24),
        post: faker.random.uuid(),
        author: faker.random.uuid()
      }
    } else {
      return [{
        text: faker.random.alphaNumeric(24),
        post: faker.random.uuid(),
        author: faker.random.uuid()
      }, {
        text: faker.random.alphaNumeric(24),
        post: faker.random.uuid(),
        author: faker.random.uuid()
      }, {
        text: faker.random.alphaNumeric(24),
        post: faker.random.uuid(),
        author: faker.random.uuid()
      }]
    }
  }

  beforeAll(async () => {
    logger.info('=====SETUP====')
    const modelPaths = glob.sync(path.resolve(__dirname, '../src/models/*.model.js'))

    db = await Db.init(modelPaths, logger)
    repo = new CommentRepository(SERVICE_NAME, db.model(MODEL_NAME), logger)

    return
  })

  afterAll(async () => {
    logger.info('=====TEARDOWN====')
    return db.close()
  })

  describe('CommentRepository', () => {
    beforeEach(async () => {
      return db.model(MODEL_NAME).destroy({
        where: {}
      })
    })

    it('should return a new db entry on create', async () => {
      const data = await generateMockData(true)

      let result = await repo.create({
        req: data,
        response: {}
      })

      result = result.toJSON()

      expect(result).not.toBeNil()

      // Stucture check/s
      expect(result).toContainAllKeys([
        'id',
        'text',
        'post',
        'author',
        'createdAt',
        'updatedAt',
        'version'
      ])

      // Type check/s
      expect(result.id).toBeString()
      expect(result.text).toBeString()
      expect(result.post).toBeString()
      expect(result.author).toBeString()
      expect(result.createdAt).toBeDate()
      expect(result.updatedAt).toBeDate()
      expect(result.version).toBeNumber()

      // Value Checks
      expect(result.text).toBe(data.text)
      expect(result.post).toBe(data.post)
      expect(result.author).toBe(data.author)
    })

    it('should return the updated db entry on update', async () => {
      const data = await generateMockData(true)
      const updateData = await generateMockData(true)

      let comment = await repo.create({
        req: data,
        response: {}
      })

      comment = comment.toJSON()

      let result = await repo.update({
        req: {
          id: comment.id,
          data: Object.assign(comment, updateData)
        },
        response: {}
      })

      result = result.toJSON()

      expect(result).not.toBeNil()

      // Stucture check/s
      expect(result).toContainAllKeys([
        'id',
        'text',
        'post',
        'author',
        'createdAt',
        'updatedAt',
        'version'
      ])

      // Type check/s
      expect(result.id).toBeString()
      expect(result.text).toBeString()
      expect(result.post).toBeString()
      expect(result.author).toBeString()
      expect(result.createdAt).toBeDate()
      expect(result.updatedAt).toBeDate()
      expect(result.version).toBeNumber()

      // Value Checks
      expect(result.id).toBe(comment.id)
      expect(result.text).toBe(updateData.text)
      expect(result.post).toBe(updateData.post)
      expect(result.author).toBe(updateData.author)
    })

    it('#should return all rows on blank query', async () => {
      const data = await generateMockData()

      await Promise.all(map(data, async (entry) => {
        const comment = await repo.create({
          req: entry,
          response: {}
        })

        return comment.toJSON()
      }))

      const { list } = await repo.findAll({
        req: {
          query: JSON.stringify({})
        },
        response: {}
      })

      expect(list).not.toBeNil()

      // Stucture check/s
      expect(list[0]).toContainAllKeys([
        'id',
        'text',
        'post',
        'author',
        'createdAt',
        'updatedAt',
        'version'
      ])

      // Type check/s
      expect(list).toBeArray()
      expect(list[0].id).toBeString()
      expect(list[0].text).toBeString()
      expect(list[0].post).toBeString()
      expect(list[0].author).toBeString()
      expect(list[0].createdAt).toBeDate()
      expect(list[0].updatedAt).toBeDate()
      expect(list[0].version).toBeNumber()

      // Value checks
      expect(list).toBeArrayOfSize(3)

      return true
    })

    it('#should return all rows matching a query', async () => {
      const data = await generateMockData()

      const entries = await Promise.all(map(data, async (entry) => {
        const comment = await repo.create({
          req: entry,
          response: {}
        })

        return comment.toJSON()
      }))

      const { list } = await repo.findAll({
        req: {
          query: JSON.stringify({
            where: {
              id: { $in: map(entries, entry => entry.id) }
            }
          })
        },
        response: {}
      })

      expect(list).not.toBeNil()

      // Stucture check/s
      expect(list[0]).toContainAllKeys([
        'id',
        'text',
        'post',
        'author',
        'createdAt',
        'updatedAt',
        'version'
      ])

      // Type check/s
      expect(list).toBeArray()
      expect(list[0].id).toBeString()
      expect(list[0].text).toBeString()
      expect(list[0].post).toBeString()
      expect(list[0].author).toBeString()
      expect(list[0].createdAt).toBeDate()
      expect(list[0].updatedAt).toBeDate()
      expect(list[0].version).toBeNumber()

      // Value checks
      expect(list).toBeArrayOfSize(3)
      expect(list.map(entry => entry.text)).toIncludeSameMembers(data.map(entry => entry.text))

      return true
    })

    it('should return a single row that matches a query', async () => {
      const data = await generateMockData(true)

      let comment = await repo.create({
        req: data,
        response: {}
      })

      comment = comment.toJSON()

      const result = await repo.findOne({
        req: {
          query: JSON.stringify({
            where: {
              id: comment.id
            }
          })
        },
        response: {}
      })

      expect(result).not.toBeNil()

      // Stucture check/s
      expect(result).toContainAllKeys([
        'id',
        'text',
        'post',
        'author',
        'createdAt',
        'updatedAt',
        'version'
      ])

      // Type check/s
      expect(result.id).toBeString()
      expect(result.text).toBeString()
      expect(result.post).toBeString()
      expect(result.author).toBeString()
      expect(result.createdAt).toBeDate()
      expect(result.updatedAt).toBeDate()
      expect(result.version).toBeNumber()

      // Value Checks
      expect(result.text).toBe(data.text)
      expect(result.post).toBe(data.post)
      expect(result.author).toBe(data.author)
    })

    it('should return the correct count that matches a query', async () => {
      const data = await generateMockData(true)

      let comment = await repo.create({
        req: data,
        response: {}
      })

      comment = comment.toJSON()

      const result = await repo.count({
        req: {
          query: JSON.stringify({
            where: {
              id: comment.id
            }
          })
        },
        response: {}
      })

      expect(result).not.toBeNil()

      // Type check/s
      expect(result.count).toBeNumber()

      // Value Checks
      expect(result.count).toBe(1)
    })

    it('should delete records properly on destroy', async () => {
      const data = await generateMockData(true)

      let comment = await repo.create({
        req: data,
        response: {}
      })

      comment = comment.toJSON()

      await repo.destroy({
        req: {
          id: comment.id
        },
        response: {}
      })

      const result = await repo.count({
        req: {
          query: JSON.stringify({
            where: {
              id: comment.id
            }
          })
        },
        response: {}
      })

      // Type check/s
      expect(result.count).toBeNumber()

      // Value Checks
      expect(result.count).toBe(0)
    })
  })
})
