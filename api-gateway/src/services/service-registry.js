import * as grpc from 'grpc'

import CommentsServiceClient from './comments/comment.client'
import PostsServiceClient from './posts/post.client'
import UsersServiceClient from './users/user.client'
import MailerServiceClient from './mailer/mailer.client'

import CommentsService from './comments/comment.service'
import PostsService from './posts/post.service'
import UsersService from './users/user.service'
import MailerService from './mailer/mailer.service'

import EventsBus from './events-bus.service'

import { serviceConfig } from '../config'

class ServiceRegistry {
  constructor(logger) {
    const grpcCredentials = grpc.credentials.createInsecure()

    const commentsServiceClient = new CommentsServiceClient(serviceConfig.comments, grpcCredentials)
    const postsServiceClient = new PostsServiceClient(serviceConfig.posts, grpcCredentials)
    const usersServiceClient = new UsersServiceClient(serviceConfig.users, grpcCredentials)
    const mailerServiceClient = new MailerServiceClient(serviceConfig.mailer, grpcCredentials)

    this._services = {
      eventsBus: new EventsBus(),
      commentsService: new CommentsService(commentsServiceClient, logger),
      postsService: new PostsService(postsServiceClient, logger),
      usersService: new UsersService(usersServiceClient, logger),
      mailerService: new MailerService(mailerServiceClient, logger)
    }
  }

  get services() {
    return this._services
  }
}

export default ServiceRegistry
