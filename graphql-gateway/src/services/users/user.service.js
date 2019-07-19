import AbstractCrudService from '../abstract-crud.service'

class UserService extends AbstractCrudService {
  constructor(client, logger) {
    super('UserService', client, logger)
  }
}

export default UserService
