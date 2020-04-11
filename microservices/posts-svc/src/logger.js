import pino from 'pino'

const logger = pino({
  safe: true,
  prettyPrint: process.env.NODE_ENV === 'dev'
})

export default logger
