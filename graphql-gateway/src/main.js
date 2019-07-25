import fs from 'fs'
import glob from 'glob'
import Redis from 'ioredis'

import { reduce } from 'lodash'
import { RedisPubSub } from 'graphql-redis-subscriptions'

import * as QueryResolvers from 'glob:./resolvers/**/*.query.js' // eslint-disable-line
import * as MutationResolvers from 'glob:./resolvers/**/*.mutation.js' // eslint-disable-line
import * as SubscriptionResolvers from 'glob:./resolvers/**/*.subscription.js' // eslint-disable-line
import * as GraphResolvers from 'glob:./resolvers/**/*.graph.js' // eslint-disable-line

import logger from './logger'
import Server from './server'
import ServiceRegistry from './services/service-registry'
import defaultPlaygroundQuery from './playground-query'

async function main() {
  const schemaPaths = glob.sync('./**/*.schema.graphql')
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

  const redisConnOpts = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    keyPrefix: process.env.NODE_ENV
  }

  const pubsub = new RedisPubSub({
    connection: redisConnOpts,
    publisher: new Redis(redisConnOpts),
    subscriber: new Redis(redisConnOpts)
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

  server.start(
    {
      defaultPlaygroundQuery,
      port: process.env.PORT || 3000
    },
    ({ port }) => {
      logger.info(`GraphQL Server is now running on port ${port}`)
    }
  )
}

main()
