const env = process.env.NODE_ENV

const graphqlConfig = {
  port: parseInt(`${process.env.GRAPHQL_PORT || 3000}`, 10)
}

const jwtConfig = {
  secret: process.env.JWT_SECRET
}

const cacheConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(`${process.env.REDIS_PORT || 6379}`, 10),
  password: process.env.REDIS_PASSWORD || undefined
}

const serviceConfig = {
  comments: process.env.COMMENTS_SVC_URL,
  posts: process.env.POSTS_SVC_URL,
  users: process.env.USERS_SVC_URL,
  mailer: process.env.MAILER_SVC_URL
}

export {
  env,
  graphqlConfig,
  jwtConfig,
  cacheConfig,
  serviceConfig
}
