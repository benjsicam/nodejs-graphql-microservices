import path from 'path'

import * as grpc from 'grpc'
import * as protoLoader from '@grpc/proto-loader'

const proto = protoLoader.loadSync(path.resolve(__dirname, '../../_proto/post.proto'), {
  enums: String,
  objects: true,
  arrays: true
})
const PostServiceClient = grpc.loadPackageDefinition(proto).post.PostService

export default PostServiceClient
