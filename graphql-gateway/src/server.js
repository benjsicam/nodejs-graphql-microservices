import { GraphQLServer } from 'graphql-yoga'
import { assign, reduce, startCase, map, groupBy } from 'lodash'
import { DateTimeResolver, EmailAddressResolver, UnsignedIntResolver } from 'graphql-scalars'
import * as yup from 'yup'

const yupValidation = {
  async Mutation(resolve, root, args, context, info) {
    const mutationField = info.schema.getMutationType().getFields()[info.fieldName]
    const mutationValidationSchema = mutationField.validationSchema

    if (mutationValidationSchema) {
      let errors = []
      try {
        await mutationValidationSchema.validate(args, { strict: true, abortEarly: false })
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          const fieldErrors = groupBy(error.inner, 'path')
          const fields = Object.keys(fieldErrors)

          await Promise.all(map(fields, async (field) => {
            let errorsHolder = []
            await Promise.all(map(fieldErrors[field], fieldError => {
              errorsHolder.push(fieldError.errors[0])
            }))
            errors.push({
              message: errorsHolder,
              field
            })
          }))
          if (errors.length > 0) return { errors }
        } else {
          throw error
        }
      }
    }

    return resolve(root, args, context, info)
  }
}

const Server = {
  async init(schema, resolvers, services) {
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
      middlewares: [yupValidation]
    })

    server.express.get('/healthz', (req, res) => {
      res.send('OK')
    })

    return server
  }
}

export default Server
