import faker from 'faker'

import { request, GraphQLClient } from 'graphql-request'

describe('Users API Testing', () => {
  let client

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
    const result = await request(`http://localhost:${process.env.PORT}/`, `
      mutation {
        signup(
          data: {
            name: "${faker.fake('{{name.firstName}} {{name.lastName}}')}",
            email: "${faker.internet.email()}",
            password: "${faker.internet.password()}",
            age: ${faker.random.number()}
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
          errors {
            field
            message
          }
        }
      }`
    )

    client = new GraphQLClient(`http://localhost:${process.env.PORT}/`, {
      headers: {
        authorization: `Bearer ${result.token}`
      }
    })
  })

  it('users#should return a collection of users', async () => {
    const result = await client.request(`
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
    `)

    expect(result).not.toBeNil()
    expect(result.users).toBeArray()

    // Stucture check/s
    expect(result.users[0]).toContainAllKeys([
      'id',
      'name',
      'email',
      'age',
      'createdAt',
      'updatedAt',
      'version'
    ])

    // Type check/s
    expect(result.users[0].id).toBeString()
    expect(result.users[0].name).toBeString()
    expect(result.users[0].email).toBeString()
    expect(result.users[0].age).toBeNumber()
    expect(result.users[0].createdAt).toBeString()
    expect(result.users[0].updatedAt).toBeString()
    expect(result.users[0].version).toBeNumber()

    return true
  })
})
