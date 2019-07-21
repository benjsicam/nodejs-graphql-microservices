import path from 'path'
import Redis from 'ioredis'

import { RedisPubSub } from 'graphql-redis-subscriptions'

import * as QueryResolvers from 'glob:./resolvers/**/*.query.js' // eslint-disable-line
import * as MutationResolvers from 'glob:./resolvers/**/*.mutation.js' // eslint-disable-line
import * as SubscriptionResolvers from 'glob:./resolvers/**/*.subscription.js' // eslint-disable-line
import * as GraphResolvers from 'glob:./resolvers/**/*.graph.js' // eslint-disable-line

import logger from './logger'
import Server from './server'
import ServiceIndex from './services/_index'
import defaultPlaygroundQuery from './default-query'

const SCHEMA_PATH = path.resolve(__dirname, 'schema.graphql')

async function main() {
  const serviceIndex = new ServiceIndex(logger)

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
    SCHEMA_PATH,
    {
      QueryResolvers,
      MutationResolvers,
      SubscriptionResolvers,
      GraphResolvers
    },
    {
      ...serviceIndex.services,
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
