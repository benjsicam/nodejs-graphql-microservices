import faker from 'faker'
import request from 'supertest'

import main from '../src/main'

describe('User Query Testing', () => {
  let server, token

  const generateMockData = async (isSingle = false) => {
    if (isSingle) {
      return {
        name: faker.fake('{{name.firstName}} {{name.lastName}}'),
        email: faker.internet.email(),
        password: faker.internet.password(),
        age: faker.random.number()
      }
    } else {
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
  }

  beforeAll(async () => {
    logger.info('=====SETUP====')
    server = main.server

    const data = await generateMockData(true)

    const result = await request(server)
      .post('/')
      .set('Accept', 'application/json')
      .send({
        query: `
          mutation signup {
            signup(
              data: {
                name: ${data.name}
                email: ${data.email}
                password: ${data.password}
                age: ${data.age}
              }
            ) {
              token
              user {
                id
                name
                email
                age
                createdAt
                updatedAt
                version
              }
              error
            }
          }
        `
      })

    token = result.body.token
  })

  afterAll(async () => {
    logger.info('=====TEARDOWN====')
    return Promise.all([
      main.publisher.quit(),
      main.subscriber.quit()
    ])
  })

  it('users#should return a collection of users', async () => {
    const result = await request(server)
      .post('/')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
          query findAllUsers {
            users {
              id
              name
              email
              age
              createdAt
              updatedAt
              version
            }
          }
        `
      })

    expect(result).not.toBeNil()

    // Stucture check/s
    expect(result[0]).toContainAllKeys([
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
    expect(result).toBeArray()
    expect(result[0].id).toBeString()
    expect(result[0].name).toBeString()
    expect(result[0].email).toBeString()
    expect(result[0].password).toBeString()
    expect(result[0].age).toBeNumber()
    expect(result[0].createdAt).toBeDate()
    expect(result[0].updatedAt).toBeDate()
    expect(result[0].version).toBeNumber()

    // Value checks
    expect(result).toBeArrayOfSize(1)

    return true
  })
})
