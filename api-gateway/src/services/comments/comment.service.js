import AbstractCrudService from '../abstract-crud.service'

class CommentsService extends AbstractCrudService {
  constructor(client, logger) {
    super(CommentsService.name, client, logger)
  }
}

export default CommentsService
