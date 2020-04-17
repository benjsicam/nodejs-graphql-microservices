import path from 'path'
import glob from 'glob'
import faker from 'faker'

import { map } from 'lodash'

import Db from '../src/db'
import logger from '../src/logger'
import PostRepository from '../src/repositories/post.repository'

const MODEL_NAME = 'Post'

describe('Database Testing', () => {
  let db,
    repo

  const generateMockData = async (isSingle = false) => {
    if (isSingle) {
      return {
        title: faker.random.words(),
        body: faker.lorem.paragraphs(),
        published: faker.random.boolean(),
        author: faker.random.uuid()
      }
    }
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

  beforeAll(async () => {
    logger.info('=====SETUP====')
    const modelPaths = glob.sync(path.resolve(__dirname, '../src/models/*.model.js'))

    db = await Db.init(modelPaths, logger)
    repo = new PostRepository(db.model(MODEL_NAME))
  })

  afterAll(async () => {
    logger.info('=====TEARDOWN====')
    return db.close()
  })

  describe('PostRepository', () => {
    beforeEach(async () => repo.destroy({
      req: { where: {} },
      response: {}
    }))

    it('should return a new db entry on create', async () => {
      const data = await generateMockData(true)

      const result = await repo.create({
        req: data,
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

    it('should return the updated db entry on update', async () => {
      const data = await generateMockData(true)
      const updateData = await generateMockData(true)

      const post = await repo.create({
        req: data,
        response: {}
      })

      const result = await repo.update({
        req: {
          id: post.id,
          data: Object.assign(post, updateData)
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

        return post
      }))

      const { edges, pageInfo } = await repo.find({
        req: {},
        response: {}
      })

      // Stucture check/s
      expect(edges[0]).toContainAllKeys([
        'node',
        'cursor'
      ])
      expect(pageInfo).toContainAllKeys([
        'startCursor',
        'endCursor',
        'hasNextPage',
        'hasPreviousPage'
      ])
      expect(edges[0].node).toContainAllKeys([
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
      expect(edges).toBeArray()
      expect(edges[0].node.id).toBeString()
      expect(edges[0].node.title).toBeString()
      expect(edges[0].node.body).toBeString()
      expect(edges[0].node.published).toBeBoolean()
      expect(edges[0].node.author).toBeString()
      expect(edges[0].node.createdAt).toBeDate()
      expect(edges[0].node.updatedAt).toBeDate()
      expect(edges[0].node.version).toBeNumber()

      // Value checks
      expect(edges).toBeArrayOfSize(3)

      return true
    })

    it('#should return all rows matching a query', async () => {
      const data = await generateMockData()

      const entries = await Promise.all(map(data, async (entry) => {
        const post = await repo.create({
          req: entry,
          response: {}
        })

        return post
      }))

      const { edges, pageInfo } = await repo.find({
        req: {
          where: JSON.stringify({
            id: { _in: map(entries, entry => entry.id) }
          })
        },
        response: {}
      })

      expect(edges).not.toBeNil()
      expect(pageInfo).not.toBeNil()

      // Stucture check/s
      expect(edges[0]).toContainAllKeys([
        'node',
        'cursor'
      ])
      expect(pageInfo).toContainAllKeys([
        'startCursor',
        'endCursor',
        'hasNextPage',
        'hasPreviousPage'
      ])
      expect(edges[0].node).toContainAllKeys([
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
      expect(edges).toBeArray()
      expect(edges[0].node.id).toBeString()
      expect(edges[0].node.title).toBeString()
      expect(edges[0].node.body).toBeString()
      expect(edges[0].node.published).toBeBoolean()
      expect(edges[0].node.author).toBeString()
      expect(edges[0].node.createdAt).toBeDate()
      expect(edges[0].node.updatedAt).toBeDate()
      expect(edges[0].node.version).toBeNumber()

      // Value checks
      expect(edges).toBeArrayOfSize(3)
      expect(map(edges, entry => entry.text)).toIncludeSameMembers(map(data, entry => entry.text))

      return true
    })

    it('should return a single row by its id', async () => {
      const data = await generateMockData(true)

      const post = await repo.create({
        req: data,
        response: {}
      })

      const result = await repo.findById({
        req: {
          id: post.id
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

    it('should return a single row that matches a query', async () => {
      const data = await generateMockData(true)

      const post = await repo.create({
        req: data,
        response: {}
      })

      const result = await repo.findOne({
        req: {
          where: JSON.stringify({
            id: post.id
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

      const post = await repo.create({
        req: data,
        response: {}
      })

      const result = await repo.count({
        req: {
          where: JSON.stringify({
            id: post.id
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

      const post = await repo.create({
        req: data,
        response: {}
      })

      await repo.destroy({
        req: {
          id: post.id
        },
        response: {}
      })

      const result = await repo.count({
        req: {
          where: JSON.stringify({
            id: post.id
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
