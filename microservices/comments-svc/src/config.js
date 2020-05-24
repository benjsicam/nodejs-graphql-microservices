const env = process.env.NODE_ENV

const grpcConfig = {
  host: process.env.GRPC_HOST || '0.0.0.0',
  port: parseInt(`${process.env.GRPC_PORT || 50051}`, 10)
}

const dbConfig = {
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(`${process.env.DB_PORT || 5432}`, 10),
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  name: process.env.DB_DATABASE || 'postgres',
  schema: process.env.DB_SCHEMA || 'public',
  sync: process.env.DB_SYNC === 'true'
}

const cacheConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(`${process.env.REDIS_PORT || 6379}`, 10),
  password: process.env.REDIS_PASSWORD || undefined
}

export { env, grpcConfig, dbConfig, cacheConfig }
