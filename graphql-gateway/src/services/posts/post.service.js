import AbstractCrudService from '../abstract-crud.service'

class PostService extends AbstractCrudService {
  constructor(client, logger) {
    super('PostService', client, logger)
  }
}

export default PostService
