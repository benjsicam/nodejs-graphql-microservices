import path from 'path'

import * as grpc from 'grpc'
import * as protoLoader from '@grpc/proto-loader'

const proto = protoLoader.loadSync(path.resolve(__dirname, '../../_proto/comment.proto'), {
  keepCase: true,
  enums: String,
  oneofs: true
})
const CommentServiceClient = grpc.loadPackageDefinition(proto).comment.CommentService

export default CommentServiceClient
