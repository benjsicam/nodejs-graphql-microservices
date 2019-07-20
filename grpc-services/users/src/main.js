import pino from 'pino'
import path from 'path'

import * as grpc from 'grpc'
import * as protoLoader from '@grpc/proto-loader'

import { Sequelize } from 'sequelize'

import UserRepository from './repositories/user.repository'

const logger = pino({
  safe: true,
  prettyPrint: process.env.NODE_ENV === 'dev'
})

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  logging: logger.info.bind(logger),
  benchmark: true,
  pool: {
    max: 3
  },
  retry: {
    max: 3,
    typeValidation: true
  }
})

const server = new grpc.Server()
const proto = protoLoader.loadSync(path.resolve(__dirname, './_proto/user.proto'))
const serviceDefinition = grpc.loadPackageDefinition(proto).user.UserService.service

db.import('./models/user.model')
db.sync().then(() => {
  server.addService(serviceDefinition, new UserRepository(db, logger))
  server.bind(`${process.env.HOST}:${process.env.PORT}`, grpc.ServerCredentials.createInsecure())
  server.start()
  logger.info(`gRPC Server is now listening on port ${process.env.PORT}`)
})
