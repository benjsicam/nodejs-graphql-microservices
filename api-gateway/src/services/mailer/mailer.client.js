import path from 'path'

import * as grpc from 'grpc'
import * as protoLoader from '@grpc/proto-loader'

const proto = protoLoader.loadSync(path.resolve(__dirname, '../../_proto/mailer.proto'), {
  keepCase: true,
  enums: String,
  oneofs: true
})
const MailerServiceClient = grpc.loadPackageDefinition(proto).mailer.MailerService

export default MailerServiceClient
