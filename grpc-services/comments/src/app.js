import Mali from 'mali'

const App = {
  async init(protoPath, serviceHandlers) {
    const app = new Mali(protoPath)

    app.use(serviceHandlers)

    return app
  }
}

export default App
