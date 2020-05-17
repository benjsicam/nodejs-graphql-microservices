import path from 'path'
import Mali from 'mali'
import nodemailer from 'nodemailer'

import errorMiddleware from '@malijs/onerror'
import loggerMiddleware from '@malijs/logger'

import { service } from 'grpc-health-check'

import logger from './logger'
import { grpcConfig, smtpConfig } from './config'

import HealthCheckService from './services/health-check.service'

import MailerClientService from './services/mailer.service'

const SERVICE_NAME = 'MailerService'

const SERVICE_PROTO = path.resolve(__dirname, '_proto/mailer.proto')

const HOST_PORT = `${grpcConfig.host}:${grpcConfig.port}`

const main = async () => {
  const transporter = nodemailer.createTransport({
    pool: true,
    ...smtpConfig
  })

  const mailerClient = new MailerClientService(transporter, logger, SERVICE_NAME)

  const MailerService = {
    send: mailerClient.send.bind(mailerClient)
  }

  const server = new Mali()
  const healthCheckService = new HealthCheckService(SERVICE_NAME)
  const healthCheckImpl = await healthCheckService.getServiceImpl()

  server.addService(SERVICE_PROTO, null, {
    keepCase: true,
    enums: String,
    oneofs: true
  })
  server.addService(service)

  server.use(
    errorMiddleware((err, ctx) => {
      logger.error(`${ctx.service}#${ctx.name}.error`, err)
      throw err
    })
  )
  server.use(
    loggerMiddleware({
      timestamp: true,
      request: true,
      response: true
    })
  )
  server.use({
    MailerService,
    ...healthCheckImpl
  })

  await server.start(HOST_PORT)

  logger.info(`gRPC Server is now listening on port ${grpcConfig.port}`)

  return {
    server
  }
}

export default main
