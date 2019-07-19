import pino from 'pino'
import path from 'path'

import * as grpc from 'grpc'
import * as protoLoader from '@grpc/proto-loader'

import { Sequelize } from 'sequelize'

import CommentRepository from './repositories/comment.repository'

const logger = pino({
  safe: true,
  prettyPrint: process.env.NODE_ENV !== 'production'
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
const proto = protoLoader.loadSync(path.resolve(__dirname, './_proto/comment.proto'))
const serviceDefinition = grpc.loadPackageDefinition(proto).comment.CommentService.service

db.import('./models/comment.model')
db.sync().then(() => {
  server.addService(serviceDefinition, new CommentRepository(db, logger))
  server.bind(`${process.env.HOST}:${process.env.PORT}`, grpc.ServerCredentials.createInsecure())
  server.start()
  logger.info(`gRPC Server is now listening on port ${process.env.PORT}`)
})
