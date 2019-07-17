import Aigle from 'aigle'

import * as grpc from '@grpc/grpc-js'

import CommentServiceClient from './comments/comment.client'
import PostServiceClient from './posts/post.client'
import UserServiceClient from './users/user.client'

import CommentService from './comments/comment.service'
import PostService from './posts/post.service'
import UserService from './users/user.service'

class ServiceIndex {
  constructor(logger) {
    const grpcCredentials = grpc.credentials.createInsecure()

    const commentServiceClient = Aigle.promisifyAll(new CommentServiceClient(process.env.COMMENTS_SVC_URL, grpcCredentials))
    const postServiceClient = Aigle.promisifyAll(new PostServiceClient(process.env.POSTS_SVC_URL, grpcCredentials))
    const userServiceClient = Aigle.promisifyAll(new UserServiceClient(process.env.USERS_SVC_URL, grpcCredentials))

    this.services = {
      commentService: new CommentService(commentServiceClient, logger),
      postService: new PostService(postServiceClient, logger),
      userService: new UserService(userServiceClient, logger)
    }
  }
}

export default ServiceIndex
