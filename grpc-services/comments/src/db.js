import { Sequelize } from 'sequelize'

const Db = {
  async init(modelPath, logger) {
    const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      logging: logger.info.bind(logger),
      benchmark: true,
      retry: {
        max: 3,
        typeValidation: true
      }
    })

    db.import(modelPath)

    await db.sync()

    return db
  }
}

export default Db
