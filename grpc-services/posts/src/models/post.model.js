import * as Sequelize from 'sequelize'

export default function(sequelize, DataTypes) {
  return sequelize.define(
    'post',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        comment: 'The post id.'
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'The post title.'
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'The post body.'
      },
      published: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Denotes if the post is published or not.'
      },
      author: {
        type: Sequelize.UUID,
        allowNull: false,
        comment: 'The author/user who created the post.'
      }
    },
    {
      timestamps: true,
      version: true
    }
  )
}
