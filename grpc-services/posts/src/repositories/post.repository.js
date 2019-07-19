import AbstractCrudRepository from './abstract-crud.repository'

class PostRepository extends AbstractCrudRepository {
  constructor(db, logger) {
    super('PostRepository', db.model('post'), logger)
  }
}

export default PostRepository
