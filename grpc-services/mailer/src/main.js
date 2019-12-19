import path from 'path'
import Mali from 'mali'
import nodemailer from 'nodemailer'

import { service } from 'grpc-health-check'

import logger from './logger'

import HealthCheckService from './services/health-check.service'

import MailerClientService from './services/mailer.service'

const SERVICE_NAME = 'MailerService'

const SERVICE_PROTO = path.resolve(__dirname, '_proto/mailer.proto')

const HOST_PORT = `${process.env.HOST}:${process.env.PORT}`

const main = async () => {
  const transporter = nodemailer.createTransport({
    pool: true,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })

  const mailerClient = new MailerClientService(transporter, logger, SERVICE_NAME)

  const MailerService = {
    send: mailerClient.send.bind(mailerClient)
  }

  const app = new Mali()
  const healthCheckService = new HealthCheckService(SERVICE_NAME)
  const healthCheckImpl = await healthCheckService.getServiceImpl()

  app.addService(SERVICE_PROTO, null, {
    enums: String,
    objects: true,
    arrays: true
  })
  app.addService(service)

  app.use({
    MailerService,
    ...healthCheckImpl
  })

  await app.start(HOST_PORT)

  logger.info(`gRPC Server is now listening on port ${process.env.PORT}`)

  return {
    app
  }
}

export default main
