import faker from 'faker'

import { request, GraphQLClient } from 'graphql-request'

import main from '../src/main'
import logger from '../src/logger'

describe('Comments API Testing', () => {
  let server, client, publisher, subscriber, post, loggedInUser

  beforeAll(async () => {
    logger.info('====COMMENTS API SETUP===')

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

    const signupResponse = await request(`http://localhost:${process.env.PORT}/`, `
      mutation {
        signup(
          data: {
            name: "${userData.name}",
            email: "${userData.email}",
            password: "${userData.password}",
            age: ${userData.age}
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

    loggedInUser = signupResponse.signup.user

    client = new GraphQLClient(`http://localhost:${process.env.PORT}/`, {
      headers: {
        authorization: `Bearer ${signupResponse.signup.token}`
      }
    })

    const postData = {
      title: faker.random.words(),
      body: faker.lorem.sentence()
    }

    const createPostResponse = await client.request(`
      mutation createPost {
        createPost(
          data: {
            title: "${postData.title}",
            body: "${postData.body}",
            published: true
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

    post = createPostResponse.createPost.post

    return
  })

  afterAll(async () => {
    return Promise.all([
      server.close(),
      publisher.quit(),
      subscriber.quit()
    ])
  })

  it('should create a comment', async () => {
    const text = faker.lorem.sentence()

    const response = await client.request(`
      mutation createComment {
        createComment(
          data: {
            text: "${text}",
            post: "${post.id}"
          }
        ) {
          errors {
            field
            message
          }
          comment {
            id
            text
            createdAt
            updatedAt
            version
            author {
              id
            }
            post {
              id
            }
          }
        }
      }
    `)

    const result = response.createComment

    // Stucture check/s
    expect(result.comment).toContainAllKeys([
      'id',
      'text',
      'createdAt',
      'updatedAt',
      'version',
      'author',
      'post'
    ])

    // Type check/s
    expect(result.comment.id).toBeString()
    expect(result.comment.text).toBeString()
    expect(result.comment.createdAt).toBeString()
    expect(result.comment.updatedAt).toBeString()
    expect(result.comment.version).toBeNumber()
    expect(result.comment.author).toBeObject()
    expect(result.comment.post).toBeObject()

    // Value check/s
    expect(result.comment.text).toBe(text)
    expect(result.comment.post.id).toBe(post.id)
    expect(result.comment.author.id).toBe(loggedInUser.id)

    return true
  })

  it('should update a comment', async () => {
    let text = faker.lorem.sentence()

    let response = await client.request(`
      mutation createComment {
        createComment(
          data: {
            text: "${text}",
            post: "${post.id}"
          }
        ) {
          errors {
            field
            message
          }
          comment {
            id
            text
            createdAt
            updatedAt
            version
          }
        }
      }
    `)

    expect(response.createComment).not.toBeNil()
    expect(response.createComment.comment).not.toBeNil()

    text = faker.lorem.sentence()

    response = await client.request(`
      mutation updateComment {
        updateComment(
          id: "${response.createComment.comment.id}"
          data: { text: "${text}" }
        ) {
          errors {
            field
            message
          }
          comment {
            id
            text
            createdAt
            updatedAt
            version
          }
        }
      }
    `)

    const result = response.updateComment

    expect(result).not.toBeNil()
    expect(result.comment).not.toBeNil()

    // Stucture check/s
    expect(result.comment).toContainAllKeys([
      'id',
      'text',
      'createdAt',
      'updatedAt',
      'version'
    ])

    // Type check/s
    expect(result.comment.id).toBeString()
    expect(result.comment.text).toBeString()
    expect(result.comment.createdAt).toBeString()
    expect(result.comment.updatedAt).toBeString()
    expect(result.comment.version).toBeNumber()

    // Value check/s
    expect(result.comment.text).toBe(text)

    return true
  })

  it('should return a collection of comments', async () => {
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

  it('should return the number of comments in the database', async () => {
    const response = await client.request(`
      query commentCount {
        commentCount
      }
    `)

    const result = response.commentCount

    expect(result).not.toBeNil()

    // Type check/s
    expect(result).toBeNumber()

    // Value check/s
    expect(result).toSatisfy(count => count > 0)

    return true
  })

  it('should delete a comment by id', async () => {
    const text = faker.lorem.sentence()

    const response = await client.request(`
      mutation createComment {
        createComment(
          data: {
            text: "${text}",
            post: "${post.id}"
          }
        ) {
          errors {
            field
            message
          }
          comment {
            id
          }
        }
      }
    `)

    const result = response.createComment
    const id = result.comment.id

    expect(result).not.toBeNil()
    expect(result.comment).not.toBeNil()

    const deleteResponse = await client.request(`
      mutation deleteComment {
        deleteComment(id: "${id}") {
          errors {
            field
            message
          }
          count
        }
      }
    `)

    expect(deleteResponse.deleteComment).not.toBeNil()

    // Type check/s
    expect(deleteResponse.deleteComment.count).toBeNumber()

    // Value check/s
    expect(deleteResponse.deleteComment.count).toSatisfy(count => count === 1)

    return true
  })
})
