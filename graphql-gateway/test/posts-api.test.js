import faker from 'faker'

import { request, GraphQLClient } from 'graphql-request'

import main from '../src/main'
import logger from '../src/logger'

describe('Posts API Testing', () => {
  let server, client, publisher, subscriber, loggedInUser

  const generateMockData = async (isSingle = false) => {
    if (isSingle) {
      return {
        title: faker.random.words(),
        body: faker.lorem.sentence(),
        published: faker.random.boolean(),
        author: faker.random.uuid()
      }
    } else {
      return [{
        title: faker.random.words(),
        body: faker.lorem.sentence(),
        published: faker.random.boolean(),
        author: faker.random.uuid()
      }, {
        title: faker.random.words(),
        body: faker.lorem.sentence(),
        published: faker.random.boolean(),
        author: faker.random.uuid()
      }, {
        title: faker.random.words(),
        body: faker.lorem.sentence(),
        published: faker.random.boolean(),
        author: faker.random.uuid()
      }]
    }
  }

  beforeAll(async () => {
    logger.info('====POSTS API SETUP===')

    const start = await main()

    server = start.httpServer
    publisher = start.publisher
    subscriber = start.subscriber

    const data = {
      name: faker.fake('{{name.firstName}} {{name.lastName}}'),
      email: faker.internet.email(),
      password: faker.internet.password(),
      age: faker.random.number()
    }

    const response = await request(`http://localhost:${process.env.PORT}/`, `
      mutation {
        signup(
          data: {
            name: "${data.name}",
            email: "${data.email}",
            password: "${data.password}",
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
          errors {
            field
            message
          }
        }
      }`
    )

    const result = response.signup

    loggedInUser = result.user

    client = new GraphQLClient(`http://localhost:${process.env.PORT}/`, {
      headers: {
        authorization: `Bearer ${result.token}`
      }
    })

    return
  })

  afterAll(async () => {
    return Promise.all([
      server.close(),
      publisher.quit(),
      subscriber.quit()
    ])
  })

  it('should create a post', async () => {
    const data = await generateMockData(true)

    const response = await client.request(`
      mutation createPost {
        createPost(
          data: {
            title: "${data.title}",
            body: "${data.body}",
            published: false
          }
        ) {
          errors {
            field
            message
          }
          post {
            id
            title
            published
            body
            createdAt
            updatedAt
            version
            author {
              id
              name
            }
            comments {
              id
              text
            }
          }
        }
      }
    `)

    const result = response.createPost

    expect(result).not.toBeNil()
    expect(result.post).not.toBeNil()

    // Stucture check/s
    expect(result.post).toContainAllKeys([
      'id',
      'title',
      'body',
      'published',
      'createdAt',
      'updatedAt',
      'version',
      'author',
      'comments'
    ])

    // Type check/s
    expect(result.post.id).toBeString()
    expect(result.post.title).toBeString()
    expect(result.post.body).toBeString()
    expect(result.post.published).toBeBoolean()
    expect(result.post.createdAt).toBeString()
    expect(result.post.updatedAt).toBeString()
    expect(result.post.version).toBeNumber()
    expect(result.post.author).toBeObject()
    expect(result.post.comments).toBeArray()

    // Value check/s
    expect(result.post.title).toBe(data.title)
    expect(result.post.body).toBe(data.body)
    expect(result.post.published).toBe(false)

    return true
  })

  it('should update a post', async () => {
    const data = await generateMockData(true)

    let response = await client.request(`
      mutation createPost {
        createPost(
          data: {
            title: "${data.title}",
            body: "${data.body}",
            published: false
          }
        ) {
          errors {
            field
            message
          }
          post {
            id
            title
            body
            published
            createdAt
            updatedAt
            version
            author {
              id
              name
            }
            comments {
              id
              text
            }
          }
        }
      }
    `)

    expect(response.createPost).not.toBeNil()
    expect(response.createPost.post).not.toBeNil()

    response = await client.request(`
      mutation updatePost {
        updatePost(
          id: "${response.createPost.post.id}",
          data: { published: true }
        ) {
          errors {
            field
            message
          }
          post {
            id
            title
            body
            published
            createdAt
            updatedAt
            version
            author {
              id
              name
            }
            comments {
              id
              text
            }
          }
        }
      }
    `)

    const result = response.updatePost

    expect(result).not.toBeNil()
    expect(result.post).not.toBeNil()

    // Stucture check/s
    expect(result.post).toContainAllKeys([
      'id',
      'title',
      'body',
      'published',
      'createdAt',
      'updatedAt',
      'version',
      'author',
      'comments'
    ])

    // Type check/s
    expect(result.post.id).toBeString()
    expect(result.post.title).toBeString()
    expect(result.post.body).toBeString()
    expect(result.post.published).toBeBoolean()
    expect(result.post.createdAt).toBeString()
    expect(result.post.updatedAt).toBeString()
    expect(result.post.version).toBeNumber()
    expect(result.post.author).toBeObject()
    expect(result.post.comments).toBeArray()

    // Value check/s
    expect(result.post.title).toBe(data.title)
    expect(result.post.body).toBe(data.body)
    expect(result.post.published).toBe(true)

    return true
  })

  it('should return the currently logged in user\'s posts', async () => {
    const result = await client.request(`
      query myPosts {
        myPosts {
          id
          title
          body
          published
          createdAt
          updatedAt
          version
          author {
            id
          }
        }
      }
    `)

    expect(result).not.toBeNil()
    expect(result.myPosts).toBeArray()

    // Stucture check/s
    expect(result.myPosts[0]).toContainAllKeys([
      'id',
      'title',
      'body',
      'published',
      'createdAt',
      'updatedAt',
      'version',
      'author'
    ])

    // Type check/s
    expect(result.myPosts[0].id).toBeString()
    expect(result.myPosts[0].title).toBeString()
    expect(result.myPosts[0].body).toBeString()
    expect(result.myPosts[0].published).toBeBoolean()
    expect(result.myPosts[0].createdAt).toBeString()
    expect(result.myPosts[0].updatedAt).toBeString()
    expect(result.myPosts[0].version).toBeNumber()
    expect(result.myPosts[0].author).toBeObject()

    // Value check/s
    expect(result.myPosts).toBeArrayOfSize(2)
    expect(result.myPosts[0].author.id).toBe(loggedInUser.id)
    expect(result.myPosts[1].author.id).toBe(loggedInUser.id)

    return true
  })

  it('should return a collection of posts', async () => {
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

  it('should retrieve a post by id', async () => {
    const data = await generateMockData(true)

    const response = await client.request(`
      mutation createPost {
        createPost(
          data: {
            title: "${data.title}",
            body: "${data.body}",
            published: false
          }
        ) {
          errors {
            field
            message
          }
          post {
            id
            title
            published
            body
            createdAt
            updatedAt
            version
            author {
              id
              name
            }
            comments {
              id
              text
            }
          }
        }
      }
    `)

    let result = response.createPost

    expect(result).not.toBeNil()
    expect(result.post).not.toBeNil()

    result = await client.request(`
      query findPost {
        post(id: "${result.post.id}") {
          id
          title
          body
          published
          createdAt
          updatedAt
          version
          author {
            id
            name
          }
        }
      }
    `)

    expect(result).not.toBeNil()
    expect(result.post).not.toBeNil()

    // Stucture check/s
    expect(result.post).toContainAllKeys([
      'id',
      'title',
      'body',
      'published',
      'createdAt',
      'updatedAt',
      'version',
      'author'
    ])

    // Type check/s
    expect(result.post.id).toBeString()
    expect(result.post.title).toBeString()
    expect(result.post.body).toBeString()
    expect(result.post.published).toBeBoolean()
    expect(result.post.createdAt).toBeString()
    expect(result.post.updatedAt).toBeString()
    expect(result.post.version).toBeNumber()
    expect(result.post.author).toBeObject()

    // Value check/s
    expect(result.post.title).toBe(data.title)
    expect(result.post.body).toBe(data.body)
    expect(result.post.published).toBe(false)

    return true
  })

  it('should return the number of posts in the database', async () => {
    const response = await client.request(`
      query postCount {
        postCount
      }
    `)

    const result = response.postCount

    expect(result).not.toBeNil()

    // Type check/s
    expect(result).toBeNumber()

    // Value check/s
    expect(result).toSatisfy(count => count > 0)

    return true
  })

  it('should delete a post by id', async () => {
    const data = await generateMockData(true)

    const response = await client.request(`
      mutation createPost {
        createPost(
          data: {
            title: "${data.title}",
            body: "${data.body}",
            published: false
          }
        ) {
          errors {
            field
            message
          }
          post {
            id
          }
        }
      }
    `)

    const result = response.createPost
    const id = result.post.id

    expect(result).not.toBeNil()
    expect(result.post).not.toBeNil()

    const deleteResponse = await client.request(`
      mutation deletePost {
        deletePost(id: "${id}") {
          errors {
            field
            message
          }
          count
        }
      }
    `)

    expect(deleteResponse.deletePost).not.toBeNil()

    // Type check/s
    expect(deleteResponse.deletePost.count).toBeNumber()

    // Value check/s
    expect(deleteResponse.deletePost.count).toSatisfy(count => count === 1)

    return true
  })
})
