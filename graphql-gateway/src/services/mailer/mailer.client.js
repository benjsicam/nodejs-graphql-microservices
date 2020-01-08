import path from 'path'

import * as grpc from 'grpc'
import * as protoLoader from '@grpc/proto-loader'

const proto = protoLoader.loadSync(path.resolve(__dirname, '../../_proto/mailer.proto'), {
  enums: String,
  objects: true,
  arrays: true
})
const MailerServiceClient = grpc.loadPackageDefinition(proto).mailer.MailerService

export default MailerServiceClient
