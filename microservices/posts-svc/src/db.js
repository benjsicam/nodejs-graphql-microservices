import Aigle from 'aigle'
import { Sequelize, Op } from 'sequelize'

import { env, dbConfig } from './config'

const { each } = Aigle

const operatorsAliases = {
  _and: Op.and,
  _or: Op.or,
  _eq: Op.eq,
  _ne: Op.ne,
  _is: Op.is,
  _not: Op.not,
  _col: Op.col,
  _gt: Op.gt,
  _gte: Op.gte,
  _lt: Op.lt,
  _lte: Op.lte,
  _between: Op.between,
  _notBetween: Op.notBetween,
  _all: Op.all,
  _in: Op.in,
  _notIn: Op.notIn,
  _like: Op.like,
  _notLike: Op.notLike,
  _startsWith: Op.startsWith,
  _endsWith: Op.endsWith,
  _substring: Op.substring,
  _iLike: Op.iLike,
  _notILike: Op.notILike,
  _regexp: Op.regexp,
  _notRegexp: Op.notRegexp,
  _iRegexp: Op.iRegexp,
  _notIRegexp: Op.notIRegexp,
  _any: Op.any,
  _contains: Op.contains,
  _contained: Op.contained,
  _overlap: Op.overlap,
  _adjacent: Op.adjacent,
  _strictLeft: Op.strictLeft,
  _strictRight: Op.strictRight,
  _noExtendRight: Op.noExtendRight,
  _noExtendLeft: Op.noExtendLeft,
  _values: Op.values
}

const Db = {
  async init (modelPaths, logger) {
    const db = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.password, {
      dialect: dbConfig.dialect,
      host: dbConfig.host,
      port: dbConfig.port,
      logging: env !== 'test' ? logger.info.bind(logger) : false,
      benchmark: true,
      retry: {
        max: 3,
        typeValidation: true
      },
      native: true,
      operatorsAliases
    })

    await each(modelPaths, modelPath => db.import(modelPath))

    if (dbConfig.sync) await db.sync()

    return db
  }
}

export default Db
