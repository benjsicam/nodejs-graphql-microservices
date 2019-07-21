import { GraphQLServer } from 'graphql-yoga'
import { assign, reduce, startCase } from 'lodash'
import { DateTime, EmailAddress, UnsignedInt } from 'graphql-scalars'

const Server = {
  async init(schemaPath, resolvers, services) {
    const server = new GraphQLServer({
      typeDefs: schemaPath,
      resolvers: {
        DateTime,
        EmailAddress,
        UnsignedInt,
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
      }
    })

    return server
  }
}

export default Server
