import fs from 'fs'
import glob from 'glob'
import path from 'path'
import Redis from 'ioredis'
import Aigle from 'aigle'

import { RedisPubSub } from 'graphql-redis-subscriptions'

import * as QueryResolvers from './resolvers/**/*.query.js' // eslint-disable-line
import * as MutationResolvers from './resolvers/**/*.mutation.js' // eslint-disable-line
import * as SubscriptionResolvers from './resolvers/**/*.subscription.js' // eslint-disable-line
import * as GraphResolvers from './resolvers/**/*.graph.js' // eslint-disable-line

import LogMiddleware from './middlewares/log.middleware'
import ValidationMiddleware from './middlewares/validation.middleware'
import HookMiddleware from './middlewares/hook.middleware'
import AuthenticationMiddleware from './middlewares/authentication.middleware'
import AuthorizationMiddleware from './middlewares/authorization.middleware'
import ErrorMiddleware from './middlewares/error.middleware'

import logger from './logger'
import Server from './server'
import HooksRegistry from './hooks/hooks-registry'
import ServiceRegistry from './services/service-registry'
import defaultPlaygroundQuery from './playground-query'

import { env, graphqlConfig, cacheConfig } from './config'

const { map, reduce } = Aigle

const main = async () => {
  const schemaPaths = glob.sync(path.resolve(__dirname, '**/*.schema.graphql'))
  const schema = await reduce(
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
  const redisHostConfig = `${cacheConfig.host || ''}`.split(',')

  let publisher
  let subscriber

  if (redisHostConfig.length > 1) {
    const redisNodes = await map(redisHostConfig, host => ({
      host,
      port: cacheConfig.port
    }))

    publisher = new Redis.Cluster(redisNodes, {
      slotsRefreshTimeout: 20000,
      redisOptions: {
        password: cacheConfig.password,
        keyPrefix: env
      }
    })
    subscriber = new Redis.Cluster(redisNodes, {
      slotsRefreshTimeout: 20000,
      redisOptions: {
        password: cacheConfig.password,
        keyPrefix: env
      }
    })
  } else {
    publisher = new Redis({
      ...cacheConfig,
      keyPrefix: env
    })
    subscriber = new Redis({
      ...cacheConfig,
      keyPrefix: env
    })
  }

  const pubsub = new RedisPubSub({
    publisher,
    subscriber
  })

  const hooksRegistry = new HooksRegistry(serviceRegistry.services, pubsub, logger)

  hooksRegistry.init()

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
    [ErrorMiddleware, LogMiddleware, AuthenticationMiddleware, AuthorizationMiddleware, ValidationMiddleware, HookMiddleware]
  )

  const httpServer = await server.start(
    {
      defaultPlaygroundQuery,
      port: graphqlConfig.port
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
