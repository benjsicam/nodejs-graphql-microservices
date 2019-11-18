import main from '../main'
import logger from '../logger'

module.exports = async () => {
  logger.info('=====GLOBAL SETUP====')
  const start = await main()

  global.__HTTPSERVER__ = start.httpServer
  global.__PUBLISHER__ = start.publisher
  global.__SUBSCRIBER__ = start.subscriber

  return true
}
