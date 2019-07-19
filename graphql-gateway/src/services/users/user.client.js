import path from 'path'

import * as grpc from 'grpc'
import * as protoLoader from '@grpc/proto-loader'

const proto = protoLoader.loadSync(path.resolve(__dirname, '../_proto/user.proto'))
const UserServiceClient = grpc.loadPackageDefinition(proto).user.UserService

export default UserServiceClient
