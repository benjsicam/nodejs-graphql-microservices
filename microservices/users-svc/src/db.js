import * as Sequelize from 'sequelize'

const { Op } = Sequelize
const operatorsAliases = {
  $and: Op.and,
  $or: Op.or,
  $eq: Op.eq,
  $ne: Op.ne,
  $is: Op.is,
  $not: Op.not,
  $col: Op.col,
  $gt: Op.gt,
  $gte: Op.gte,
  $lt: Op.lt,
  $lte: Op.lte,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $all: Op.all,
  $in: Op.in,
  $notIn: Op.notIn,
  $like: Op.like,
  $notLike: Op.notLike,
  $startsWith: Op.startsWith,
  $endsWith: Op.endsWith,
  $substring: Op.substring,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $any: Op.any,
  $contains: Op.contains,
  $contained: Op.contained,
  $overlap: Op.overlap,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $values: Op.values
}

const Db = {
  async init (modelPaths, logger) {
    const db = new Sequelize.Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      logging: process.env.NODE_ENV !== 'test' ? logger.info.bind(logger) : false,
      benchmark: true,
      retry: {
        max: 3,
        typeValidation: true
      },
      native: true,
      operatorsAliases
    })

    modelPaths.forEach((modelPath) => {
      db.import(modelPath)
    })

    await db.sync()

    return db
  }
}

export default Db
