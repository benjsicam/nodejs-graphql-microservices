import * as Sequelize from 'sequelize'

export default function(sequelize, DataTypes) {
  return sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
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
      timestamps: true,
      version: true
    }
  )
}
