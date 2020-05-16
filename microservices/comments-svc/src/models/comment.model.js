import paginate from 'sequelize-cursor-pagination'
import * as Sequelize from 'sequelize'

import { dbConfig } from '../config'

export default function (sequelize, DataTypes) {
  class Comment extends Sequelize.Model {}

  Comment.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV1,
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
    modelName: 'Comment',
    tableName: 'comments',
    timestamps: true,
    underscored: true,
    version: true,
    schema: dbConfig.schema,
    sequelize
  })

  paginate({
    methodName: 'findAndPaginate',
    primaryKeyField: 'id'
  })(Comment)

  return Comment
}
