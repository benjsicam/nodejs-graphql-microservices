import paginate from 'sequelize-cursor-pagination'
import * as Sequelize from 'sequelize'

import { dbConfig } from '../config'

export default function (sequelize, DataTypes) {
  class User extends Sequelize.Model {}

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV1,
        comment: 'The user id.'
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "The user's name."
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        comment: "The user's email."
      },
      password: {
        type: DataTypes.STRING,
        comment: "The user's password"
      },
      age: {
        type: DataTypes.INTEGER,
        comment: "The user's age."
      }
    },
    {
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      underscored: true,
      version: true,
      schema: dbConfig.schema,
      sequelize
    }
  )

  paginate({
    methodName: 'findAndPaginate',
    primaryKeyField: 'id'
  })(User)

  return User
}
