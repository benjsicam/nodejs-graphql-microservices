import * as grpc from 'grpc'

import CommentServiceClient from './comments/comment.client'
import PostServiceClient from './posts/post.client'
import UserServiceClient from './users/user.client'
import MailerServiceClient from './mailer/mailer.client'

import CommentService from './comments/comment.service'
import PostService from './posts/post.service'
import UserService from './users/user.service'
import MailerService from './mailer/mailer.service'

import EventsBus from './events-bus.service'

import { serviceConfig } from '../config'

class ServiceRegistry {
  constructor (logger) {
    const grpcCredentials = grpc.credentials.createInsecure()

    const commentServiceClient = new CommentServiceClient(serviceConfig.comments, grpcCredentials)
    const postServiceClient = new PostServiceClient(serviceConfig.posts, grpcCredentials)
    const userServiceClient = new UserServiceClient(serviceConfig.users, grpcCredentials)
    const mailerServiceClient = new MailerServiceClient(serviceConfig.mailer, grpcCredentials)

    this._services = {
      eventsBus: new EventsBus(),
      commentService: new CommentService(commentServiceClient, logger),
      postService: new PostService(postServiceClient, logger),
      userService: new UserService(userServiceClient, logger),
      mailerService: new MailerService(mailerServiceClient, logger)
    }
  }

  get services () {
    return this._services
  }
}

export default ServiceRegistry
