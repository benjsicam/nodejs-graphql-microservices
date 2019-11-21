import logger from '../logger'

module.exports = async () => {
  logger.info('=====GLOBAL TEARDOWN====')
  return Promise.all([
    global.__HTTPSERVER__.close(),
    global.__PUBLISHER__.quit(),
    global.__SUBSCRIBER__.quit()
  ])
}
