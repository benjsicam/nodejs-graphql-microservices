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
        allowNull: false,
        comment: "The user's email."
      },
      age: {
        type: Sequelize.INTEGER,
        comment: "The user's age."
      }
    },
    {
      timestamps: true,
      version: true
    }
  )
}
