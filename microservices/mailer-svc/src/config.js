const grpcConfig = {
  host: process.env.GRPC_HOST || '0.0.0.0',
  port: parseInt(`${process.env.GRPC_PORT || 50051}`, 10)
}

const smtpConfig = {
  host: process.env.SMTP_HOST,
  port: parseInt(`${process.env.SMTP_PORT || 587}`, 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
}

export {
  grpcConfig,
  smtpConfig
}
