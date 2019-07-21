import path from 'path'

import Db from './db'
import App from './app'
import logger from './logger'

import UserRepository from './repositories/user.repository'

const MODEL_PATH = path.resolve(__dirname, 'models/user.model')
const PROTO_PATH = path.resolve(__dirname, '_proto/user.proto')

const MODEL_NAME = 'user'
const SERVICE_NAME = 'UserService'

const HOST_PORT = `${process.env.HOST}:${process.env.PORT}`

async function main() {
  const db = await Db.init(MODEL_PATH, logger)
  const repo = new UserRepository(SERVICE_NAME, db.model(MODEL_NAME), logger)

  const UserService = {
    findAll: repo.findAll.bind(repo),
    findOne: repo.findOne.bind(repo),
    count: repo.count.bind(repo),
    create: repo.create.bind(repo),
    update: repo.update.bind(repo),
    destroy: repo.destroy.bind(repo)
  }

  const app = await App.init(PROTO_PATH, { UserService })

  app.start(HOST_PORT)
  logger.info(`gRPC Server is now listening on port ${process.env.PORT}`)
}

main()
