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
  host: string,
  port: number,
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

interface GameConfig {
  jwt: GameJWTConfig
}

interface GameJWTConfig {
  accessToken: JwtTokenConfig
}

interface JwtTokenConfig {
  secret: string,
  expiry: number
}

interface JwtConfig {
  accessToken: JwtTokenConfig,
  refreshToken: JwtTokenConfig
}

interface EnvConfig {
  production: string,
  development: string,
  test: string
}

export interface Config {
  app: AppConfig,
  clientId: ClientIdConfig,
  database: DatabaseConfig,
  env: EnvConfig,
  game: GameConfig
  jwt: JwtConfig,
}
