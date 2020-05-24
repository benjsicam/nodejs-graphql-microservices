import main from './main'

const app = {}

async function gracefulExit() {
  const { publisher, subscriber, httpServer } = app

  if (publisher) publisher.disconnect()
  if (subscriber) subscriber.disconnect()
  if (httpServer) httpServer.close()

  process.exit(0)
}

;['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, gracefulExit)
})

main()
  .then((obj) => {
    Object.assign(app, obj)
  })
  .catch((err) => {
    throw err
  })
