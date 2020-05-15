import path from 'path'

import * as grpc from 'grpc'
import * as protoLoader from '@grpc/proto-loader'

const proto = protoLoader.loadSync(path.resolve(__dirname, '../../_proto/post.proto'), {
  keepCase: true,
  enums: String,
  oneofs: true
})
const PostServiceClient = grpc.loadPackageDefinition(proto).post.PostService

export default PostServiceClient
