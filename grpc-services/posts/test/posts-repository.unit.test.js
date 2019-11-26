import path from 'path'
import glob from 'glob'
import faker from 'faker'

import { map } from 'lodash'

import Db from '../src/db'
import logger from '../src/logger'
import PostRepository from '../src/repositories/post.repository'

const MODEL_NAME = 'post'
const SERVICE_NAME = 'PostService'

describe('Database Testing', () => {
  let db, repo

  const generateMockData = async (isSingle = false) => {
    if (isSingle) {
      return {
        title: faker.random.words(),
        body: faker.lorem.paragraphs(),
        published: faker.random.boolean(),
        author: faker.random.uuid()
      }
    } else {
      return [{
        title: faker.random.words(),
        body: faker.lorem.paragraphs(),
        published: faker.random.boolean(),
        author: faker.random.uuid()
      }, {
        title: faker.random.words(),
        body: faker.lorem.paragraphs(),
        published: faker.random.boolean(),
        author: faker.random.uuid()
      }, {
        title: faker.random.words(),
        body: faker.lorem.paragraphs(),
        published: faker.random.boolean(),
        author: faker.random.uuid()
      }]
    }
  }

  beforeAll(async () => {
    logger.info('=====SETUP====')
    const modelPaths = glob.sync(path.resolve(__dirname, '../src/models/*.model.js'))

    db = await Db.init(modelPaths, logger)
    repo = new PostRepository(SERVICE_NAME, db.model(MODEL_NAME), logger)

    return
  })

  afterAll(async () => {
    logger.info('=====TEARDOWN====')
    return db.close()
  })

  describe('PostRepository', () => {
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
        'title',
        'body',
        'published',
        'author',
        'createdAt',
        'updatedAt',
        'version'
      ])

      // Type check/s
      expect(result.id).toBeString()
      expect(result.title).toBeString()
      expect(result.body).toBeString()
      expect(result.published).toBeBoolean()
      expect(result.author).toBeString()
      expect(result.createdAt).toBeDate()
      expect(result.updatedAt).toBeDate()
      expect(result.version).toBeNumber()

      // Value Checks
      expect(result.title).toBe(data.title)
      expect(result.body).toBe(data.body)
      expect(result.published).toBe(data.published)
      expect(result.author).toBe(data.author)
    })

    it('should return the updated db entry on update', async () => {
      const data = await generateMockData(true)
      const updateData = await generateMockData(true)

      let post = await repo.create({
        req: data,
        response: {}
      })

      post = post.toJSON()

      let result = await repo.update({
        req: {
          id: post.id,
          data: Object.assign(post, updateData)
        },
        response: {}
      })

      result = result.toJSON()

      expect(result).not.toBeNil()

      // Stucture check/s
      expect(result).toContainAllKeys([
        'id',
        'title',
        'body',
        'published',
        'author',
        'createdAt',
        'updatedAt',
        'version'
      ])

      // Type check/s
      expect(result.id).toBeString()
      expect(result.title).toBeString()
      expect(result.body).toBeString()
      expect(result.published).toBeBoolean()
      expect(result.author).toBeString()
      expect(result.createdAt).toBeDate()
      expect(result.updatedAt).toBeDate()
      expect(result.version).toBeNumber()

      // Value Checks
      expect(result.id).toBe(post.id)
      expect(result.title).toBe(updateData.title)
      expect(result.body).toBe(updateData.body)
      expect(result.published).toBe(updateData.published)
      expect(result.author).toBe(updateData.author)
    })

    it('#should return all rows on blank query', async () => {
      const data = await generateMockData()

      await Promise.all(map(data, async (entry) => {
        const post = await repo.create({
          req: entry,
          response: {}
        })

        return post.toJSON()
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
        'title',
        'body',
        'published',
        'author',
        'createdAt',
        'updatedAt',
        'version'
      ])

      // Type check/s
      expect(list).toBeArray()
      expect(list[0].id).toBeString()
      expect(list[0].title).toBeString()
      expect(list[0].body).toBeString()
      expect(list[0].published).toBeBoolean()
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
        const post = await repo.create({
          req: entry,
          response: {}
        })

        return post.toJSON()
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
        'title',
        'body',
        'published',
        'author',
        'createdAt',
        'updatedAt',
        'version'
      ])

      // Type check/s
      expect(list).toBeArray()
      expect(list[0].id).toBeString()
      expect(list[0].title).toBeString()
      expect(list[0].body).toBeString()
      expect(list[0].published).toBeBoolean()
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

      let post = await repo.create({
        req: data,
        response: {}
      })

      post = post.toJSON()

      const result = await repo.findOne({
        req: {
          query: JSON.stringify({
            where: {
              id: post.id
            }
          })
        },
        response: {}
      })

      expect(result).not.toBeNil()

      // Stucture check/s
      expect(result).toContainAllKeys([
        'id',
        'title',
        'body',
        'published',
        'author',
        'createdAt',
        'updatedAt',
        'version'
      ])

      // Type check/s
      expect(result.id).toBeString()
      expect(result.title).toBeString()
      expect(result.body).toBeString()
      expect(result.published).toBeBoolean()
      expect(result.author).toBeString()
      expect(result.createdAt).toBeDate()
      expect(result.updatedAt).toBeDate()
      expect(result.version).toBeNumber()

      // Value Checks
      expect(result.title).toBe(data.title)
      expect(result.body).toBe(data.body)
      expect(result.published).toBe(data.published)
      expect(result.author).toBe(data.author)
    })

    it('should return the correct count that matches a query', async () => {
      const data = await generateMockData(true)

      let post = await repo.create({
        req: data,
        response: {}
      })

      post = post.toJSON()

      const result = await repo.count({
        req: {
          query: JSON.stringify({
            where: {
              id: post.id
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

      let post = await repo.create({
        req: data,
        response: {}
      })

      post = post.toJSON()

      await repo.destroy({
        req: {
          id: post.id
        },
        response: {}
      })

      const result = await repo.count({
        req: {
          query: JSON.stringify({
            where: {
              id: post.id
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
