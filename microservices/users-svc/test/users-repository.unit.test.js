import path from 'path'
import glob from 'glob'
import faker from 'faker'

import { map } from 'lodash'

import Db from '../src/db'
import logger from '../src/logger'
import UserRepository from '../src/repositories/user.repository'

const MODEL_NAME = 'User'

describe('Database Testing', () => {
  let db,
    repo

  const generateMockData = async (isSingle = false) => {
    if (isSingle) {
      return {
        name: faker.fake('{{name.firstName}} {{name.lastName}}'),
        email: faker.internet.email(),
        password: faker.internet.password(),
        age: faker.random.number()
      }
    }
    return [{
      name: faker.fake('{{name.firstName}} {{name.lastName}}'),
      email: faker.internet.email(),
      password: faker.internet.password(),
      age: faker.random.number()
    }, {
      name: faker.fake('{{name.firstName}} {{name.lastName}}'),
      email: faker.internet.email(),
      password: faker.internet.password(),
      age: faker.random.number()
    }, {
      name: faker.fake('{{name.firstName}} {{name.lastName}}'),
      email: faker.internet.email(),
      password: faker.internet.password(),
      age: faker.random.number()
    }]
  }

  beforeAll(async () => {
    logger.info('=====SETUP====')
    const modelPaths = glob.sync(path.resolve(__dirname, '../src/models/*.model.js'))

    db = await Db.init(modelPaths, logger)
    repo = new UserRepository(db.model(MODEL_NAME))
  })

  afterAll(async () => {
    logger.info('=====TEARDOWN====')
    return db.close()
  })

  describe('UserRepository', () => {
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
        'name',
        'email',
        'password',
        'age',
        'createdAt',
        'updatedAt',
        'version'
      ])

      // Type check/s
      expect(result.id).toBeString()
      expect(result.name).toBeString()
      expect(result.email).toBeString()
      expect(result.password).toBeString()
      expect(result.age).toBeNumber()
      expect(result.createdAt).toBeDate()
      expect(result.updatedAt).toBeDate()
      expect(result.version).toBeNumber()

      // Value Checks
      expect(result.name).toBe(data.name)
      expect(result.email).toBe(data.email)
      expect(result.password).toBe(data.password)
      expect(result.age).toBe(data.age)
    })

    it('should return the updated db entry on update', async () => {
      const data = await generateMockData(true)
      const updateData = await generateMockData(true)

      const user = await repo.create({
        req: data,
        response: {}
      })

      const result = await repo.update({
        req: {
          id: user.id,
          data: Object.assign(user, updateData)
        },
        response: {}
      })

      expect(result).not.toBeNil()

      // Stucture check/s
      expect(result).toContainAllKeys([
        'id',
        'name',
        'email',
        'password',
        'age',
        'createdAt',
        'updatedAt',
        'version'
      ])

      // Type check/s
      expect(result.id).toBeString()
      expect(result.name).toBeString()
      expect(result.email).toBeString()
      expect(result.password).toBeString()
      expect(result.age).toBeNumber()
      expect(result.createdAt).toBeDate()
      expect(result.updatedAt).toBeDate()
      expect(result.version).toBeNumber()

      // Value Checks
      expect(result.id).toBe(user.id)
      expect(result.name).toBe(updateData.name)
      expect(result.email).toBe(updateData.email)
      expect(result.password).toBe(updateData.password)
      expect(result.age).toBe(updateData.age)
    })

    it('#should return all rows on blank query', async () => {
      const data = await generateMockData()

      await Promise.all(map(data, async (entry) => {
        const user = await repo.create({
          req: entry,
          response: {}
        })

        return user
      }))

      const { edges, pageInfo } = await repo.find({
        req: {
          where: JSON.stringify({})
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
        'name',
        'email',
        'password',
        'age',
        'createdAt',
        'updatedAt',
        'version'
      ])

      // Type check/s
      expect(edges).toBeArray()
      expect(edges[0].node.id).toBeString()
      expect(edges[0].node.name).toBeString()
      expect(edges[0].node.email).toBeString()
      expect(edges[0].node.password).toBeString()
      expect(edges[0].node.age).toBeNumber()
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
        const user = await repo.create({
          req: entry,
          response: {}
        })

        return user
      }))

      const { edges, pageInfo } = await repo.find({
        req: {
          where: JSON.stringify({
            id: { $in: map(entries, entry => entry.id) }
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
        'name',
        'email',
        'password',
        'age',
        'createdAt',
        'updatedAt',
        'version'
      ])

      // Type check/s
      expect(edges).toBeArray()
      expect(edges[0].node.id).toBeString()
      expect(edges[0].node.name).toBeString()
      expect(edges[0].node.email).toBeString()
      expect(edges[0].node.password).toBeString()
      expect(edges[0].node.age).toBeNumber()
      expect(edges[0].node.createdAt).toBeDate()
      expect(edges[0].node.updatedAt).toBeDate()
      expect(edges[0].node.version).toBeNumber()

      // Value checks
      expect(edges).toBeArrayOfSize(3)
      expect(map(edges, entry => entry.text)).toIncludeSameMembers(map(data, entry => entry.text))

      return true
    })

    it('should return a single row that matches a query', async () => {
      const data = await generateMockData(true)

      let user = await repo.create({
        req: data,
        response: {}
      })

      const result = await repo.findOne({
        req: {
          where: JSON.stringify({
            id: user.id
          })
        },
        response: {}
      })

      expect(result).not.toBeNil()

      // Stucture check/s
      expect(result).toContainAllKeys([
        'id',
        'name',
        'email',
        'password',
        'age',
        'createdAt',
        'updatedAt',
        'version'
      ])

      // Type check/s
      expect(result.id).toBeString()
      expect(result.name).toBeString()
      expect(result.email).toBeString()
      expect(result.password).toBeString()
      expect(result.age).toBeNumber()
      expect(result.createdAt).toBeDate()
      expect(result.updatedAt).toBeDate()
      expect(result.version).toBeNumber()

      // Value Checks
      expect(result.name).toBe(data.name)
      expect(result.email).toBe(data.email)
      expect(result.password).toBe(data.password)
      expect(result.age).toBe(data.age)
    })

    it('should return the correct count that matches a query', async () => {
      const data = await generateMockData(true)

      const user = await repo.create({
        req: data,
        response: {}
      })

      const result = await repo.count({
        req: {
          where: JSON.stringify({
            id: user.id
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

      const user = await repo.create({
        req: data,
        response: {}
      })

      await repo.destroy({
        req: {
          where: JSON.stringify({
            id: user.id
          })
        },
        response: {}
      })

      const result = await repo.count({
        req: {
          where: JSON.stringify({
            id: user.id
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
