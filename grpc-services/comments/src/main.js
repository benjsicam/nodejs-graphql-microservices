import path from 'path'
import glob from 'glob'
import Mali from 'mali'
import Redis from 'ioredis'

import { map } from 'lodash'
import { service } from 'grpc-health-check'

import Db from './db'
import logger from './logger'

import CacheService from './services/cache.service'
import CacheMiddleware from './middlewares/cache.middleware'
import HealthCheckService from './services/health-check.service'
import CommentRepository from './repositories/comment.repository'

const MODEL_NAME = 'comment'
const SERVICE_NAME = 'CommentService'

const SERVICE_PROTO = path.resolve(__dirname, '_proto/comment.proto')

const HOST_PORT = `${process.env.HOST}:${process.env.PORT}`

const main = async () => {
  const modelPaths = glob.sync(path.resolve(__dirname, '../**/*.model.js'))
  const db = await Db.init(modelPaths, logger)
  const repo = new CommentRepository(SERVICE_NAME, db.model(MODEL_NAME), logger)

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

  const CommentService = {
    findAll: [cacheMiddleware.find('comments'), repo.findAll.bind(repo)],
    findOne: [cacheMiddleware.read('comments'), repo.findOne.bind(repo)],
    count: repo.count.bind(repo),
    create: [cacheMiddleware.write('comments'), repo.create.bind(repo)],
    update: [cacheMiddleware.write('comments'), repo.update.bind(repo)],
    destroy: [cacheMiddleware.remove('comments'), repo.destroy.bind(repo)]
  }

  const app = new Mali()
  const healthCheckService = new HealthCheckService(SERVICE_NAME)
  const healthCheckImpl = await healthCheckService.getServiceImpl()

  app.addService(SERVICE_PROTO, null, {
    enums: String,
    objects: true,
    arrays: true
  })
  app.addService(service)

  app.use({
    CommentService,
    ...healthCheckImpl
  })

  await app.start(HOST_PORT)

  logger.info(`gRPC Server is now listening on port ${process.env.PORT}`)

  return {
    app,
    cache,
    db
  }
}

export default main
