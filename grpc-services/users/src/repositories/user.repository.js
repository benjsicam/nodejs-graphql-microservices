import AbstractCrudRepository from './abstract-crud.repository'

class UserRepository extends AbstractCrudRepository {
  constructor(db, logger) {
    super('UserService', db.model('user'), logger)
  }
}

export default UserRepository
