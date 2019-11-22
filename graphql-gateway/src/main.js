import fs from 'fs'
import glob from 'glob'
import path from 'path'
import Redis from 'ioredis'

import { map, reduce } from 'lodash'
import { RedisPubSub } from 'graphql-redis-subscriptions'

import * as QueryResolvers from 'glob:./resolvers/**/*.query.js' // eslint-disable-line
import * as MutationResolvers from 'glob:./resolvers/**/*.mutation.js' // eslint-disable-line
import * as SubscriptionResolvers from 'glob:./resolvers/**/*.subscription.js' // eslint-disable-line
import * as GraphResolvers from 'glob:./resolvers/**/*.graph.js' // eslint-disable-line

import logger from './logger'
import Server from './server'
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

  let publisher, subscriber
  let redisOptions = {}

  if (redisHostConfig.length > 1) {
    let redisNodes = map(redisHostConfig, host => {
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
      redisOptions
    })
    subscriber = new Redis.Cluster(redisNodes, {
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
    connection: redisOptions,
    publisher,
    subscriber
  })

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
    }
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
