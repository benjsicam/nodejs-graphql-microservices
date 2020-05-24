import faker from 'faker'

import { request, GraphQLClient } from 'graphql-request'

import main from '../src/main'
import logger from '../src/logger'

describe('Posts API Testing', () => {
  let server, publisher, subscriber, loggedInUser

  const client = new GraphQLClient(`http://localhost:${process.env.GRAPHQL_PORT}/`, {
    credentials: 'include'
  })

  const generateMockData = async (isSingle = false) => {
    if (isSingle) {
      return {
        title: faker.random.words(),
        body: faker.lorem.sentence(),
        published: faker.random.boolean(),
        author: faker.random.uuid()
      }
    }
    return [
      {
        title: faker.random.words(),
        body: faker.lorem.sentence(),
        published: faker.random.boolean(),
        author: faker.random.uuid()
      },
      {
        title: faker.random.words(),
        body: faker.lorem.sentence(),
        published: faker.random.boolean(),
        author: faker.random.uuid()
      },
      {
        title: faker.random.words(),
        body: faker.lorem.sentence(),
        published: faker.random.boolean(),
        author: faker.random.uuid()
      }
    ]
  }

  beforeAll(async () => {
    logger.info('====POSTS API SETUP===')

    const start = await main()

    server = start.httpServer
    publisher = start.publisher
    subscriber = start.subscriber

    const userData = {
      name: faker.fake('{{name.firstName}} {{name.lastName}}'),
      email: faker.internet.email(),
      password: faker.internet.password(),
      age: faker.random.number()
    }

    await client.request(`
      mutation {
        signup(
          data: {
            name: "${userData.name}",
            email: "${userData.email}",
            password: "${userData.password}",
            age: ${userData.age}
          }
        ) {
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
      }`)

    const loginResponse = await client.request(`
      mutation {
        login(
          data: {
            email: "${userData.email}",
            password: "${userData.password}"
          }
        ) {
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
      }`)

    loggedInUser = loginResponse.login.user
  })

  afterAll(async () => {
    publisher.disconnect()
    subscriber.disconnect()
    server.close()
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
              edges {
                node {
                  id
                  text
                }
                cursor
              }
              pageInfo {
                startCursor
                endCursor
                hasNextPage
                hasPreviousPage
              }
            }
          }
        }
      }
    `)

    const result = response.createPost

    expect(result).not.toBeNil()
    expect(result.post).not.toBeNil()

    // Stucture check/s
    expect(result.post).toContainAllKeys(['id', 'title', 'body', 'published', 'createdAt', 'updatedAt', 'version', 'author', 'comments'])

    // Type check/s
    expect(result.post.id).toBeString()
    expect(result.post.title).toBeString()
    expect(result.post.body).toBeString()
    expect(result.post.published).toBeBoolean()
    expect(result.post.createdAt).toBeString()
    expect(result.post.updatedAt).toBeString()
    expect(result.post.version).toBeNumber()
    expect(result.post.author).toBeObject()
    expect(result.post.comments.edges).toBeArray()

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
              edges {
                node {
                  id
                  text
                }
                cursor
              }
              pageInfo {
                startCursor
                endCursor
                hasNextPage
                hasPreviousPage
              }
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
              edges {
                node {
                  id
                  text
                }
                cursor
              }
              pageInfo {
                startCursor
                endCursor
                hasNextPage
                hasPreviousPage
              }
            }
          }
        }
      }
    `)

    const result = response.updatePost

    expect(result).not.toBeNil()
    expect(result.post).not.toBeNil()

    // Stucture check/s
    expect(result.post).toContainAllKeys(['id', 'title', 'body', 'published', 'createdAt', 'updatedAt', 'version', 'author', 'comments'])

    // Type check/s
    expect(result.post.id).toBeString()
    expect(result.post.title).toBeString()
    expect(result.post.body).toBeString()
    expect(result.post.published).toBeBoolean()
    expect(result.post.createdAt).toBeString()
    expect(result.post.updatedAt).toBeString()
    expect(result.post.version).toBeNumber()
    expect(result.post.author).toBeObject()
    expect(result.post.comments.edges).toBeArray()

    // Value check/s
    expect(result.post.title).toBe(data.title)
    expect(result.post.body).toBe(data.body)
    expect(result.post.published).toBe(true)

    return true
  })

  it("should return the currently logged in user's posts", async () => {
    const { myPosts } = await client.request(`
      query myPosts {
        myPosts {
          edges {
            node {
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
            cursor
          }
          pageInfo {
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
          }
        }
      }
    `)

    expect(myPosts).not.toBeNil()
    expect(myPosts.edges).not.toBeNil()
    expect(myPosts.pageInfo).not.toBeNil()

    expect(myPosts.edges).toBeArray()
    expect(myPosts.pageInfo).toBeObject()

    // Stucture check/s
    expect(myPosts.edges[0]).toContainAllKeys(['node', 'cursor'])
    expect(myPosts.pageInfo).toContainAllKeys(['startCursor', 'endCursor', 'hasNextPage', 'hasPreviousPage'])
    expect(myPosts.edges[0].node).toContainAllKeys(['id', 'title', 'body', 'published', 'createdAt', 'updatedAt', 'version', 'author'])

    // Type check/s
    expect(myPosts.edges[0].node.id).toBeString()
    expect(myPosts.edges[0].node.title).toBeString()
    expect(myPosts.edges[0].node.body).toBeString()
    expect(myPosts.edges[0].node.published).toBeBoolean()
    expect(myPosts.edges[0].node.createdAt).toBeString()
    expect(myPosts.edges[0].node.updatedAt).toBeString()
    expect(myPosts.edges[0].node.version).toBeNumber()
    expect(myPosts.edges[0].node.author).toBeObject()

    // Value check/s
    expect(myPosts.edges).toBeArrayOfSize(2)
    expect(myPosts.edges[0].node.author.id).toBe(loggedInUser.id)
    expect(myPosts.edges[1].node.author.id).toBe(loggedInUser.id)

    return true
  })

  it('should return a collection of posts', async () => {
    const { posts } = await client.request(`
      query findAllPosts {
        posts {
          edges {
            node {
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
            cursor
          }
          pageInfo {
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
          }
        }
      }
    `)

    expect(posts).not.toBeNil()
    expect(posts.edges).not.toBeNil()
    expect(posts.pageInfo).not.toBeNil()

    expect(posts.edges).toBeArray()
    expect(posts.pageInfo).toBeObject()

    // Stucture check/s
    expect(posts.edges[0]).toContainAllKeys(['node', 'cursor'])
    expect(posts.pageInfo).toContainAllKeys(['startCursor', 'endCursor', 'hasNextPage', 'hasPreviousPage'])
    expect(posts.edges[0].node).toContainAllKeys(['id', 'title', 'body', 'published', 'createdAt', 'updatedAt', 'version', 'author'])

    // Type check/s
    expect(posts.edges[0].node.id).toBeString()
    expect(posts.edges[0].node.title).toBeString()
    expect(posts.edges[0].node.body).toBeString()
    expect(posts.edges[0].node.published).toBeBoolean()
    expect(posts.edges[0].node.createdAt).toBeString()
    expect(posts.edges[0].node.updatedAt).toBeString()
    expect(posts.edges[0].node.version).toBeNumber()
    expect(posts.edges[0].node.author).toBeObject()

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
              edges {
                node {
                  id
                  text
                }
                cursor
              }
              pageInfo {
                startCursor
                endCursor
                hasNextPage
                hasPreviousPage
              }
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
    expect(result.post).toContainAllKeys(['id', 'title', 'body', 'published', 'createdAt', 'updatedAt', 'version', 'author'])

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
    expect(result).toSatisfy((count) => count > 0)

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
    const { id } = result.post

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
    expect(deleteResponse.deletePost.count).toSatisfy((count) => count === 1)

    return true
  })
})
