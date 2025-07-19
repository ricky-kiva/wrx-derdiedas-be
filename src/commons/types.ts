interface AppConfig {
  port: number,
  host: string
}

interface DBMongoDBConfig {
  host: string,
  port: number,
  database: string,
  user: string,
  password: string
}

interface DBRedisConfig {
  database: number,
  password: string
}

interface DatabaseConfig {
  mongodb: DBMongoDBConfig,
  redis: DBRedisConfig
}

interface ClientIdConfig {
  google: string
}

interface JwtConfig {
  accessTokenSecret: string,
  refreshTokenSecret: string
}

export interface Config {
  app: AppConfig,
  clientId: ClientIdConfig,
  database: DatabaseConfig,
  jwt: JwtConfig
}
