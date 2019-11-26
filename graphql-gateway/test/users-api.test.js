import faker from 'faker'

import { request, GraphQLClient } from 'graphql-request'

import main from '../src/main'
import logger from '../src/logger'

describe('Users API Testing', () => {
  let server, client, publisher, subscriber, loggedInUser, password

  const generateMockData = async (isSingle = false) => {
    if (isSingle) {
      return {
        name: faker.fake('{{name.firstName}} {{name.lastName}}'),
        email: faker.internet.email(),
        password: faker.internet.password(),
        age: faker.random.number({ min: 20, max: 80 })
      }
    } else {
      return [{
        name: faker.fake('{{name.firstName}} {{name.lastName}}'),
        email: faker.internet.email(),
        password: faker.internet.password(),
        age: faker.random.number({ min: 20, max: 80 })
      }, {
        name: faker.fake('{{name.firstName}} {{name.lastName}}'),
        email: faker.internet.email(),
        password: faker.internet.password(),
        age: faker.random.number({ min: 20, max: 80 })
      }, {
        name: faker.fake('{{name.firstName}} {{name.lastName}}'),
        email: faker.internet.email(),
        password: faker.internet.password(),
        age: faker.random.number({ min: 20, max: 80 })
      }]
    }
  }

  beforeAll(async () => {
    logger.info('====USERS API SETUP===')

    const start = await main()

    server = start.httpServer
    publisher = start.publisher
    subscriber = start.subscriber

    const data = await generateMockData(true)

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
    password = data.password

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

  it('should login a user', async () => {
    const response = await client.request(`
      mutation login {
        login(
          data: {
            email: "${loggedInUser.email}",
            password: "${password}"
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
      }
    `)

    const result = response.login

    expect(result).not.toBeNil()
    expect(result.token).not.toBeNil()
    expect(result.user).not.toBeNil()

    // Stucture check/s
    expect(result.user).toContainAllKeys([
      'id',
      'name',
      'email',
      'age',
      'createdAt',
      'updatedAt',
      'version'
    ])

    // Type check/s
    expect(result.token).toBeString()
    expect(result.user.id).toBeString()
    expect(result.user.name).toBeString()
    expect(result.user.email).toBeString()
    expect(result.user.age).toBeNumber()
    expect(result.user.createdAt).toBeString()
    expect(result.user.updatedAt).toBeString()
    expect(result.user.version).toBeNumber()

    // Value check/s
    expect(result.user.id).toBe(loggedInUser.id)
    expect(result.user.name).toBe(loggedInUser.name)
    expect(result.user.email).toBe(loggedInUser.email)
    expect(result.user.age).toBe(loggedInUser.age)
    expect(result.user.createdAt).toBe(loggedInUser.createdAt)
    expect(result.user.updatedAt).toBe(loggedInUser.updatedAt)
    expect(result.user.version).toBe(loggedInUser.version)

    return true
  })

  it('should retrieve currently logged in user profile', async () => {
    const response = await client.request(`
      query me {
        me {
          id
          name
          email
          age
          createdAt
          updatedAt
          version
          posts {
            id
            title
            body
          }
          comments {
            id
            text
          }
        }
      }
    `)

    const result = response.me

    expect(result).not.toBeNil()

    // Stucture check/s
    expect(result).toContainAllKeys([
      'id',
      'name',
      'email',
      'age',
      'createdAt',
      'updatedAt',
      'version',
      'posts',
      'comments'
    ])

    // Type check/s
    expect(result.id).toBeString()
    expect(result.name).toBeString()
    expect(result.email).toBeString()
    expect(result.age).toBeNumber()
    expect(result.createdAt).toBeString()
    expect(result.updatedAt).toBeString()
    expect(result.version).toBeNumber()
    expect(result.posts).toBeArray()
    expect(result.comments).toBeArray()

    // Value check/s
    expect(result.id).toBe(loggedInUser.id)
    expect(result.name).toBe(loggedInUser.name)
    expect(result.email).toBe(loggedInUser.email)
    expect(result.age).toBe(loggedInUser.age)
    expect(result.createdAt).toBe(loggedInUser.createdAt)
    expect(result.updatedAt).toBe(loggedInUser.updatedAt)
    expect(result.version).toBe(loggedInUser.version)
    expect(result.posts).toBeArrayOfSize(0)
    expect(result.comments).toBeArrayOfSize(0)

    return true
  })

  it('should return a collection of users', async () => {
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

  it('should retrieve a single user by id', async () => {
    const result = await client.request(`
      query findUser {
        user(id: "${loggedInUser.id}") {
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
    expect(result.user).not.toBeNil()

    // Stucture check/s
    expect(result.user).toContainAllKeys([
      'id',
      'name',
      'email',
      'age',
      'createdAt',
      'updatedAt',
      'version'
    ])

    // Type check/s
    expect(result.user.id).toBeString()
    expect(result.user.name).toBeString()
    expect(result.user.email).toBeString()
    expect(result.user.age).toBeNumber()
    expect(result.user.createdAt).toBeString()
    expect(result.user.updatedAt).toBeString()
    expect(result.user.version).toBeNumber()

    // Value check/s
    expect(result.user.id).toBe(loggedInUser.id)
    expect(result.user.name).toBe(loggedInUser.name)
    expect(result.user.email).toBe(loggedInUser.email)
    expect(result.user.age).toBe(loggedInUser.age)
    expect(result.user.version).toBe(loggedInUser.version)

    return true
  })

  it('should return the number of users in the database', async () => {
    const response = await client.request(`
      query userCount {
        userCount
      }
    `)

    const result = response.userCount

    expect(result).not.toBeNil()

    // Type check/s
    expect(result).toBeNumber()

    // Value check/s
    expect(result).toSatisfy(count => count > 0)

    return true
  })

  it('should update the profile details', async () => {
    const name = faker.fake('{{name.firstName}} {{name.lastName}}')
    const age = faker.random.number({ min: 20, max: 80 })

    const response = await client.request(`
      mutation updateProfile {
        updateProfile(data: {
          name: "${name}",
          age: ${age}
        }) {
          errors {
            field
            message
          }
          user {
            id
            name
            email
            age
            createdAt
            updatedAt
            version
          }
        }
      }
    `)

    const result = response.updateProfile

    expect(result).not.toBeNil()
    expect(result.user).not.toBeNil()

    // Stucture check/s
    expect(result.user).toContainAllKeys([
      'id',
      'name',
      'email',
      'age',
      'createdAt',
      'updatedAt',
      'version'
    ])

    // Type check/s
    expect(result.user.id).toBeString()
    expect(result.user.name).toBeString()
    expect(result.user.email).toBeString()
    expect(result.user.age).toBeNumber()
    expect(result.user.createdAt).toBeString()
    expect(result.user.updatedAt).toBeString()
    expect(result.user.version).toBeNumber()

    // Value check/s
    expect(result.user.name).toBe(name)
    expect(result.user.age).toBe(age)

    Object.assign(loggedInUser, result.user)

    return true
  })

  it('should update the user email', async () => {
    const newEmail = faker.internet.email()

    const response = await client.request(`
      mutation updateEmail {
        updateEmail(
          data: {
            email: "${newEmail}",
            currentPassword: "${password}"
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
      }
    `)

    const result = response.updateEmail

    expect(result).not.toBeNil()
    expect(result.user).not.toBeNil()

    // Stucture check/s
    expect(result.user).toContainAllKeys([
      'id',
      'name',
      'email',
      'age',
      'createdAt',
      'updatedAt',
      'version'
    ])

    // Type check/s
    expect(result.user.id).toBeString()
    expect(result.user.name).toBeString()
    expect(result.user.email).toBeString()
    expect(result.user.age).toBeNumber()
    expect(result.user.createdAt).toBeString()
    expect(result.user.updatedAt).toBeString()
    expect(result.user.version).toBeNumber()

    // Value check/s
    expect(result.user.email).toBe(newEmail)

    Object.assign(loggedInUser, result.user)

    return true
  })

  it('should update the user password', async () => {
    const newPassword = faker.internet.password()

    let response = await client.request(`
      mutation updatePassword {
        updatePassword(
          data: {
            currentPassword: "${password}",
            newPassword: "${newPassword}",
            confirmPassword: "${newPassword}"
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
      }
    `)

    let result = response.updatePassword

    expect(result).not.toBeNil()
    expect(result.token).not.toBeNil()
    expect(result.user).not.toBeNil()

    await new Promise(resolve => {
      setTimeout(resolve, 3000)
    })

    response = await client.request(`
      mutation login {
        login(
          data: {
            email: "${result.user.email}",
            password: "${newPassword}"
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
      }
    `)

    result = response.login

    expect(result).not.toBeNil()
    expect(result.token).not.toBeNil()
    expect(result.user).not.toBeNil()

    return true
  })
})
