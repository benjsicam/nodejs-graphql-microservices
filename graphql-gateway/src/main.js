import path from 'path'
import pino from 'pino'
import Redis from 'ioredis'

import { GraphQLServer } from 'graphql-yoga'
import { assign, reduce, startCase } from 'lodash'
import { RedisPubSub } from 'graphql-redis-subscriptions'

import * as QueryResolvers from 'glob:./resolvers/**/*.query.js' // eslint-disable-line
import * as MutationResolvers from 'glob:./resolvers/**/*.mutation.js' // eslint-disable-line
import * as SubscriptionResolvers from 'glob:./resolvers/**/*.subscription.js' // eslint-disable-line
import * as GraphResolvers from 'glob:./resolvers/**/*.graph.js' // eslint-disable-line

import ServiceIndex from './services/_index'
import defaultPlaygroundQuery from './default-query'

const logger = pino({
  safe: true,
  prettyPrint: process.env.NODE_ENV === 'dev'
})

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

const server = new GraphQLServer({
  typeDefs: path.resolve(__dirname, 'schema.graphql'),
  resolvers: {
    Query: reduce(
      QueryResolvers,
      (res, val) => {
        return assign(res, val)
      },
      {}
    ),
    Mutation: reduce(
      MutationResolvers,
      (res, val) => {
        return assign(res, val)
      },
      {}
    ),
    Subscription: reduce(
      SubscriptionResolvers,
      (res, val) => {
        return assign(res, val)
      },
      {}
    ),
    ...reduce(
      GraphResolvers,
      (res, val, key) => {
        const obj = {}
        obj[startCase(key.substr(key.lastIndexOf('$') + 1))] = val
        return assign(res, obj)
      },
      {}
    )
  },
  context(req) {
    return {
      ...req,
      ...serviceIndex.services,
      logger,
      pubsub
    }
  }
})

server.start(
  {
    defaultPlaygroundQuery,
    port: process.env.PORT || 3000
  },
  ({ port }) => {
    logger.info(`GraphQL Server is now running on port ${port}`)
  }
)
