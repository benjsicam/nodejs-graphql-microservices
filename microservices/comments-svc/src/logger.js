import pino from 'pino'

import { env } from './config'

const logger = pino({
  safe: true,
  prettyPrint: env === 'dev'
})

export default logger
