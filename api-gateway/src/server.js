import cors from 'cors'
import Aigle from 'aigle'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import expressPlayground from 'graphql-playground-middleware-express'

import { get, assign, startCase } from 'lodash'
import { GraphQLServer } from 'graphql-yoga'

import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { DateTimeResolver, EmailAddressResolver, UnsignedIntResolver } from 'graphql-scalars'
import { GraphQLJSONObject } from 'graphql-type-json'

import { jwtConfig } from './config'
import defaultPlaygroundQuery from './playground-query'

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
      context: ({ request, response }) => {
        const { user } = request

        return {
          req: request,
          res: response,
          user,
          ...services
        }
      },
      middlewares,
      cors: false
    })

    passport.use('jwt', new JwtStrategy({
      secretOrKey: jwtConfig.accessTokenSecret,
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
      jwtFromRequest: ExtractJwt.fromExtractors([req => get(req, 'cookies.accessToken')])
    }, async (token, done) => {
      const { userService } = services
      const userId = get(token, 'userId')

      if (userId) {
        try {
          const user = await userService.findById(userId)

          done(null, user)
        } catch (err) {
          done()
        }
      } else {
        done()
      }
    }))

    server.express.use(cors({
      origin: '*',
      credentials: true
    }))
    server.express.use(cookieParser())
    server.express.use(passport.initialize())
    server.express.post('/', (req, res, next) => {
      passport.authenticate('jwt', {
        session: false
      }, (err, user) => {
        if (!err && user) req.logIn(user)

        return next()
      })(req, res, next)
    })

    server.express.get('/', expressPlayground({
      endpoint: '/',
      subscriptionEndpoint: '/',
      settings: {
        'request.credentials': 'include'
      },
      tabs: [{
        name: 'API',
        endpoint: '/',
        query: defaultPlaygroundQuery
      }]
    }))

    server.express.get('/healthz', (req, res) => {
      res.send('OK')
    })

    return server
  }
}

export default Server
