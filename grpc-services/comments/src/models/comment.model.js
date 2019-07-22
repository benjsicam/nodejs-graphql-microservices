import * as Sequelize from 'sequelize'

export default function(sequelize, DataTypes) {
  return sequelize.define(
    'comment',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        comment: 'The comment id.'
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'The comment body or message.'
      },
      post: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'The post to which the comment is associated to.'
      },
      author: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'The author/user who posted the comment.'
      }
    },
    {
      timestamps: true,
      version: true
    }
  )
}
