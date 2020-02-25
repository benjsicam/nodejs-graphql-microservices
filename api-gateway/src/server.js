import { GraphQLServer } from 'graphql-yoga'
import { assign, reduce, startCase } from 'lodash'
import { DateTimeResolver, EmailAddressResolver, UnsignedIntResolver } from 'graphql-scalars'

const Server = {
  async init(schema, resolvers, services, middlewares) {
    const server = new GraphQLServer({
      typeDefs: schema,
      resolvers: {
        DateTime: DateTimeResolver,
        EmailAddress: EmailAddressResolver,
        UnsignedInt: UnsignedIntResolver,
        Query: reduce(
          resolvers.QueryResolvers,
          (res, val) => {
            return assign(res, val)
          },
          {}
        ),
        Mutation: reduce(
          resolvers.MutationResolvers,
          (res, val) => {
            return assign(res, val)
          },
          {}
        ),
        Subscription: reduce(
          resolvers.SubscriptionResolvers,
          (res, val) => {
            return assign(res, val)
          },
          {}
        ),
        ...reduce(
          resolvers.GraphResolvers,
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
