import Aigle from 'aigle'

import { GraphQLServer } from 'graphql-yoga'
import { assign, startCase } from 'lodash'
import { DateTimeResolver, EmailAddressResolver, UnsignedIntResolver } from 'graphql-scalars'
import { GraphQLJSONObject } from 'graphql-type-json'

const { reduce } = Aigle

const Server = {
  async init (schema, resolvers, services, middlewares) {
    const server = new GraphQLServer({
      typeDefs: schema,
      resolvers: {
        DateTime: DateTimeResolver,
        EmailAddress: EmailAddressResolver,
        UnsignedInt: UnsignedIntResolver,
        JSONObject: GraphQLJSONObject,
        Query: await reduce(
          resolvers.QueryResolvers,
          (res, val) => assign(res, val),
          {}
        ),
        Mutation: await reduce(
          resolvers.MutationResolvers,
          (res, val) => assign(res, val),
          {}
        ),
        Subscription: await reduce(
          resolvers.SubscriptionResolvers,
          (res, val) => assign(res, val),
          {}
        ),
        ...await reduce(
          resolvers.GraphResolvers,
          (res, val, key) => {
            const obj = {}
            const graph = startCase(key.substr(key.lastIndexOf('$') + 1)).replace(/\s/, '')

            obj[graph] = val

            return assign(res, obj)
          },
          {}
        )
      },
      context (req) {
        return {
          ...req,
          ...services
        }
      },
      middlewares
    })

    server.express.get('/healthz', (req, res) => {
      res.send('OK')
    })

    return server
  }
}

export default Server
