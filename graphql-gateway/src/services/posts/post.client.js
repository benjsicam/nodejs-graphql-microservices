import path from 'path'

import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

const PROTO_PATH = path.resolve(__dirname, '../_proto/post.proto')

const packageDefinition = protoLoader.loadSync(PROTO_PATH)
const PostServiceClient = grpc.loadPackageDefinition(packageDefinition).PostService

export { PostServiceClient }
