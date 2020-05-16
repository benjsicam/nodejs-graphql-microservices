import path from 'path'
import glob from 'glob'
import Mali from 'mali'
import Redis from 'ioredis'

import errorMiddleware from '@malijs/onerror'
import loggerMiddleware from '@malijs/logger'

import { map } from 'lodash'
import { service } from 'grpc-health-check'

import Db from './db'
import logger from './logger'
import { grpcConfig, cacheConfig } from './config'

import CacheService from './services/cache.service'
import CacheMiddleware from './middlewares/cache.middleware'
import HealthCheckService from './services/health-check.service'
import UserRepository from './repositories/user.repository'

const MODEL_NAME = 'User'
const SERVICE_NAME = 'UserService'

const SERVICE_PROTO = path.resolve(__dirname, '_proto/user.proto')

const HOST_PORT = `${grpcConfig.host}:${grpcConfig.port}`

const main = async () => {
  const modelPaths = glob.sync(path.resolve(__dirname, '../**/*.model.js'))
  const db = await Db.init(modelPaths, logger)
  const repo = new UserRepository(db.model(MODEL_NAME))

  const redisHostConfig = `${cacheConfig.host || ''}`.split(',')

  let cache

  if (redisHostConfig.length > 1) {
    const redisNodes = await map(redisHostConfig, host => ({
      host,
      port: cacheConfig.password
    }))

    cache = new Redis.Cluster(redisNodes, {
      slotsRefreshTimeout: 20000,
      redisOptions: {
        password: cacheConfig.password
      }
    })
  } else {
    cache = new Redis(cacheConfig)
  }

  const cacheService = new CacheService(cache, logger)
  const cacheMiddleware = new CacheMiddleware(cacheService, logger)

  const UserService = {
    find: [cacheMiddleware.find('users'), repo.find.bind(repo)],
    findById: [cacheMiddleware.read('users'), repo.findById.bind(repo)],
    findOne: [cacheMiddleware.read('users'), repo.findOne.bind(repo)],
    count: repo.count.bind(repo),
    create: [cacheMiddleware.write('users'), repo.create.bind(repo)],
    update: [cacheMiddleware.write('users'), repo.update.bind(repo)],
    destroy: [cacheMiddleware.remove('users'), repo.destroy.bind(repo)]
  }

  const app = new Mali()
  const healthCheckService = new HealthCheckService(SERVICE_NAME)
  const healthCheckImpl = await healthCheckService.getServiceImpl()

  app.addService(SERVICE_PROTO, null, {
    keepCase: true,
    enums: String,
    oneofs: true
  })
  app.addService(service)

  app.use(
    errorMiddleware((err, ctx) => {
      logger.error(`${ctx.service}#${ctx.name}.error`, err)
      throw err
    })
  )
  app.use(
    loggerMiddleware({
      timestamp: true,
      request: true,
      response: true
    })
  )
  app.use({
    UserService,
    ...healthCheckImpl
  })

  await app.start(HOST_PORT)

  logger.info(`gRPC Server is now listening on port ${grpcConfig.port}`)

  return {
    app,
    cache,
    db
  }
}

export default main
