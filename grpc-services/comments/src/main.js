import path from 'path'
import glob from 'glob'
import Redis from 'ioredis'

import Db from './db'
import App from './app'
import logger from './logger'

import CacheService from './services/cache.service'
import CacheMiddleware from './middlewares/cache.middleware'
import CommentRepository from './repositories/comment.repository'

const PROTO_PATH = path.resolve(__dirname, '_proto/comment.proto')

const MODEL_NAME = 'comment'
const SERVICE_NAME = 'CommentService'

const HOST_PORT = `${process.env.HOST}:${process.env.PORT}`

async function main() {
  const modelPaths = glob.sync('./**/*.model.js')
  const db = await Db.init(modelPaths, logger)
  const repo = new CommentRepository(SERVICE_NAME, db.model(MODEL_NAME), logger)

  const redisConnOpts = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
  const cacheService = new CacheService(new Redis(redisConnOpts), logger)
  const cacheMiddleware = new CacheMiddleware(cacheService, logger)

  const CommentService = {
    findAll: [cacheMiddleware.find('comments'), repo.findAll.bind(repo)],
    findOne: [cacheMiddleware.read('comments'), repo.findOne.bind(repo)],
    count: repo.count.bind(repo),
    create: [cacheMiddleware.write('comments'), repo.create.bind(repo)],
    update: [cacheMiddleware.write('comments'), repo.update.bind(repo)],
    destroy: [cacheMiddleware.remove('comments'), repo.destroy.bind(repo)]
  }

  const app = await App.init(PROTO_PATH, { CommentService })

  app.start(HOST_PORT)
  logger.info(`gRPC Server is now listening on port ${process.env.PORT}`)
}

main()
