import fs from 'fs'
import glob from 'glob'
import path from 'path'
import Redis from 'ioredis'

import { map, reduce } from 'lodash'
import { RedisPubSub } from 'graphql-redis-subscriptions'

import * as QueryResolvers from './resolvers/**/*.query.js' // eslint-disable-line
import * as MutationResolvers from './resolvers/**/*.mutation.js' // eslint-disable-line
import * as SubscriptionResolvers from './resolvers/**/*.subscription.js' // eslint-disable-line
import * as GraphResolvers from './resolvers/**/*.graph.js' // eslint-disable-line

import LogMiddleware from './middlewares/log.middleware'
import ValidationMiddleware from './middlewares/validation.middleware'
import HookMiddleware from './middlewares/hook.middleware'
import AuthenticationMiddleware from './middlewares/authentication.middleware'
import ErrorMiddleware from './middlewares/error.middleware'

import logger from './logger'
import Server from './server'
import HooksRegistry from './hooks/hooks-registry'
import ServiceRegistry from './services/service-registry'
import defaultPlaygroundQuery from './playground-query'

const main = async () => {
  const schemaPaths = glob.sync(path.resolve(__dirname, '**/*.schema.graphql'))
  const schema = reduce(
    schemaPaths,
    (schemaContents, filePath) => {
      const fileContents = fs.readFileSync(filePath, {
        encoding: 'utf8'
      })

      return schemaContents.concat(fileContents)
    },
    ''
  )

  const serviceRegistry = new ServiceRegistry(logger)
  const redisHostConfig = `${process.env.REDIS_HOST || ''}`.split(',')

  let publisher
  let subscriber
  let redisOptions = {}

  if (redisHostConfig.length > 1) {
    const redisNodes = map(redisHostConfig, host => {
      return {
        host,
        port: process.env.REDIS_PORT
      }
    })

    redisOptions = {
      password: process.env.REDIS_PASSWORD,
      keyPrefix: process.env.NODE_ENV
    }

    publisher = new Redis.Cluster(redisNodes, {
      slotsRefreshTimeout: 20000,
      redisOptions
    })
    subscriber = new Redis.Cluster(redisNodes, {
      slotsRefreshTimeout: 20000,
      redisOptions
    })
  } else {
    redisOptions = {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      keyPrefix: process.env.NODE_ENV
    }

    publisher = new Redis(redisOptions)
    subscriber = new Redis(redisOptions)
  }

  const pubsub = new RedisPubSub({
    publisher,
    subscriber
  })

  const hooksRegistry = new HooksRegistry(serviceRegistry.services, logger)

  hooksRegistry.register()

  const server = await Server.init(
    schema,
    {
      QueryResolvers,
      MutationResolvers,
      SubscriptionResolvers,
      GraphResolvers
    },
    {
      ...serviceRegistry.services,
      pubsub,
      logger
    },
    [ErrorMiddleware, LogMiddleware, AuthenticationMiddleware, ValidationMiddleware, HookMiddleware]
  )

  const httpServer = await server.start(
    {
      defaultPlaygroundQuery,
      port: process.env.PORT || 3000
    },
    ({ port }) => {
      logger.info(`GraphQL Server is now running on port ${port}`)
    }
  )

  return {
    publisher,
    subscriber,
    httpServer
  }
}

export default main
