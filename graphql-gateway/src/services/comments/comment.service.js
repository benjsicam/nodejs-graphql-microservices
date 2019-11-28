import AbstractCrudService from '../abstract-crud.service'

class CommentService extends AbstractCrudService {
  constructor(client, logger) {
    super('CommentService', client, logger)
  }
}

export default CommentService
