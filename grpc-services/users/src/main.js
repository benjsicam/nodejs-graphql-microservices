import path from 'path'
import glob from 'glob'
import Redis from 'ioredis'

import { map } from 'lodash'

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

const main = async () => {
  const modelPaths = glob.sync(path.resolve(__dirname, '../**/*.model.js'))
  const db = await Db.init(modelPaths, logger)
  const repo = new UserRepository(SERVICE_NAME, db.model(MODEL_NAME), logger)

  const redisHostConfig = `${process.env.REDIS_HOST || ''}`.split(',')

  let cache
  let redisOptions = {}

  if (redisHostConfig.length > 1) {
    const redisNodes = map(redisHostConfig, host => {
      return {
        host,
        port: process.env.REDIS_PORT
      }
    })

    redisOptions = {
      password: process.env.REDIS_PASSWORD
    }

    cache = new Redis.Cluster(redisNodes, {
      slotsRefreshTimeout: 20000,
      redisOptions
    })
  } else {
    redisOptions = {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD
    }

    cache = new Redis(redisOptions)
  }

  const cacheService = new CacheService(cache, logger)
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

export default main
