import faker from 'faker'

import { request, GraphQLClient } from 'graphql-request'

describe('Comments API Testing', () => {
  let client

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

  it('comments#should return a collection of comments', async () => {
    const result = await client.request(`
      query findAllComments {
        comments {
          id
          text
          createdAt
          updatedAt
          version
        }
      }
    `)

    expect(result).not.toBeNil()
    expect(result.comments).toBeArray()

    // Stucture check/s
    expect(result.comments[0]).toContainAllKeys([
      'id',
      'text',
      'createdAt',
      'updatedAt',
      'version'
    ])

    // Type check/s
    expect(result.comments[0].id).toBeString()
    expect(result.comments[0].text).toBeString()
    expect(result.comments[0].createdAt).toBeString()
    expect(result.comments[0].updatedAt).toBeString()
    expect(result.comments[0].version).toBeNumber()

    return true
  })
})
