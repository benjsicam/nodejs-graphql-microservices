import faker from 'faker'

import { request, GraphQLClient } from 'graphql-request'

describe('Posts API Testing', () => {
  let client

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

  it('posts#should return a collection of posts', async () => {
    const result = await client.request(`
      query findAllPosts {
        posts {
          id
          title
          body
          published
          createdAt
          updatedAt
          version
        }
      }
    `)

    expect(result).not.toBeNil()
    expect(result.posts).toBeArray()

    // Stucture check/s
    expect(result.posts[0]).toContainAllKeys([
      'id',
      'title',
      'body',
      'published',
      'createdAt',
      'updatedAt',
      'version'
    ])

    // Type check/s
    expect(result.posts[0].id).toBeString()
    expect(result.posts[0].title).toBeString()
    expect(result.posts[0].body).toBeString()
    expect(result.posts[0].published).toBeBoolean()
    expect(result.posts[0].createdAt).toBeString()
    expect(result.posts[0].updatedAt).toBeString()
    expect(result.posts[0].version).toBeNumber()

    return true
  })
})
