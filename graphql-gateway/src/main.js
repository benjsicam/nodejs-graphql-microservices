import pino from 'pino'

import Redis from 'ioredis'

import { GraphQLServer } from 'graphql-yoga'
import { assign, reduce, startCase } from 'lodash'
import { RedisPubSub } from 'graphql-redis-subscriptions'

import ServiceIndex from './services/_index'
import * as QueryResolver from 'glob:./resolvers/**/*.query.js' // eslint-disable-line
import * as MutationResolver from 'glob:./resolvers/**/*.mutation.js' // eslint-disable-line
import * as SubscriptionResolver from 'glob:./resolvers/**/*.subscription.js' // eslint-disable-line
import * as GraphResolver from 'glob:./resolvers/**/*.graph.js' // eslint-disable-line

const logger = pino({
  safe: true,
  prettyPrint: process.env.NODE_ENV !== 'production'
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
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query: reduce(
      QueryResolver,
      (res, val) => {
        return assign(res, val)
      },
      {}
    ),
    Mutation: reduce(
      MutationResolver,
      (res, val) => {
        return assign(res, val)
      },
      {}
    ),
    Subscription: reduce(
      SubscriptionResolver,
      (res, val) => {
        return assign(res, val)
      },
      {}
    ),
    ...reduce(
      GraphResolver,
      (res, val, key) => {
        const obj = {}
        obj[startCase(key.substr(key.lastIndexOf('$') + 1))] = val
        return assign(res, obj)
      },
      {}
    )
  },
  context: req => ({ ...req, ...serviceIndex.services, logger, pubsub })
})

server.start(
  {
    port: process.env.PORT || 3000
  },
  ({ port }) => {
    console.log(`GraphQL Server is now running on port ${port}`)
  }
)
