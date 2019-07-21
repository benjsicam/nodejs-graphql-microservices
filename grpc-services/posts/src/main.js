import path from 'path'

import Db from './db'
import App from './app'
import logger from './logger'

import PostRepository from './repositories/post.repository'

const MODEL_PATH = path.resolve(__dirname, 'models/post.model')
const PROTO_PATH = path.resolve(__dirname, '_proto/post.proto')

const MODEL_NAME = 'post'
const SERVICE_NAME = 'PostService'

const HOST_PORT = `${process.env.HOST}:${process.env.PORT}`

async function main() {
  const db = await Db.init(MODEL_PATH, logger)
  const repo = new PostRepository(SERVICE_NAME, db.model(MODEL_NAME), logger)

  const PostService = {
    findAll: repo.findAll.bind(repo),
    findOne: repo.findOne.bind(repo),
    count: repo.count.bind(repo),
    create: repo.create.bind(repo),
    update: repo.update.bind(repo),
    destroy: repo.destroy.bind(repo)
  }

  const app = await App.init(PROTO_PATH, { PostService })

  app.start(HOST_PORT)
  logger.info(`gRPC Server is now listening on port ${process.env.PORT}`)
}

main()
