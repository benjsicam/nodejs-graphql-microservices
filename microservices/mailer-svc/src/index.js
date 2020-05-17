import main from './main'

const app = {}

async function gracefulExit () {
  const { server } = app

  if (server) await server.close()
}

['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, gracefulExit)
})

main().then((obj) => {
  Object.assign(app, obj)
}).catch((err) => {
  throw err
})
