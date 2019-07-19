import AbstractCrudRepository from './abstract-crud.repository'

class CommentRepository extends AbstractCrudRepository {
  constructor(db, logger) {
    super('CommentRepository', db.model('comment'), logger)
  }
}

export default CommentRepository
