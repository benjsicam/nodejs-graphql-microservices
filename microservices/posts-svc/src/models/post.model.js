import paginate from 'sequelize-cursor-pagination'
import * as Sequelize from 'sequelize'

export default function (sequelize, DataTypes) {
  class Post extends Sequelize.Model {}

  Post.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV1,
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
    modelName: 'Post',
    tableName: 'posts',
    timestamps: true,
    underscored: true,
    version: true,
    schema: process.env.DB_SCHEMA || 'public',
    sequelize
  })

  paginate({
    methodName: 'findAndPaginate',
    primaryKeyField: 'id'
  })(Post)

  return Post
}
