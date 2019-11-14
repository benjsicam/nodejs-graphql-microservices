import path from 'path'
import glob from 'glob'
import Redis from 'ioredis'

import Db from './db'
import App from './app'
import logger from './logger'

import CacheService from './services/cache.service'
import CacheMiddleware from './middlewares/cache.middleware'
import UserRepository from './repositories/user.repository'

const PROTO_PATH = path.resolve(__dirname, '_proto/user.proto')

const MODEL_NAME = 'user'
const SERVICE_NAME = 'UserService'

const HOST_PORT = `${process.env.HOST}:${process.env.PORT}`

async function main() {
  const modelPaths = glob.sync(path.resolve(__dirname, '../**/*.model.js'))
  const db = await Db.init(modelPaths, logger)
  const repo = new UserRepository(SERVICE_NAME, db.model(MODEL_NAME), logger)

  const redisConnOpts = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
  const cacheService = new CacheService(new Redis(redisConnOpts), logger)
  const cacheMiddleware = new CacheMiddleware(cacheService, logger)

  const UserService = {
    findAll: [cacheMiddleware.find('users'), repo.findAll.bind(repo)],
    findOne: [cacheMiddleware.read('users'), repo.findOne.bind(repo)],
    count: repo.count.bind(repo),
    create: [cacheMiddleware.write('users'), repo.create.bind(repo)],
    update: [cacheMiddleware.write('users'), repo.update.bind(repo)],
    destroy: [cacheMiddleware.remove('users'), repo.destroy.bind(repo)]
  }

  const app = await App.init(PROTO_PATH, { UserService })

  app.start(HOST_PORT)
  logger.info(`gRPC Server is now listening on port ${process.env.PORT}`)
}

main()
