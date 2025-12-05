import dotenv from 'dotenv';
import path from 'path';
import { Config } from './types';

const ENV_PRODUCTION = 'production';
const ENV_DEVELOPMENT = 'development';
const ENV_TEST = 'test';

const envFile = (process.env.NODE_ENV === ENV_TEST)
  ? '.test.env'
  : '.env';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

function getEnvVar(key: string, fallback?: string): string {
  const varValue = process.env[key] ?? fallback;
  if (!varValue) throw new Error(`Missing environment variable: ${key}`);

  return varValue;
}

const config: Config = {
  app: {
    port: Number(process.env.PORT),
    host: process.env.NODE_ENV !== ENV_PRODUCTION
      ? 'localhost'
      : '0.0.0.0'
  },
  clientId: {
    google: getEnvVar('GOOGLE_CLIENT_ID')
  },
  database: {
    mongodb: {
      host: getEnvVar('MONGO_HOST'),
      port: Number(getEnvVar('MONGO_PORT')),
      database: getEnvVar('MONGO_DATABASE'),
      user: getEnvVar('MONGO_USER'),
      password: getEnvVar('MONGO_PASSWORD')
    },
    redis: {
      host: getEnvVar('REDIS_HOST'),
      port: Number(getEnvVar('REDIS_PORT', '6379')),
      database: Number(getEnvVar('REDIS_DATABASE')),
      password: getEnvVar('REDIS_PASSWORD')
    }
  },
  env: {
    production: ENV_PRODUCTION,
    development: ENV_DEVELOPMENT,
    test: ENV_TEST
  },
  jwt: {
    accessToken: {
      secret: getEnvVar('JWT_ACCESS_TOKEN_SECRET'),
      expiry: Number(getEnvVar('JWT_ACCESS_TOKEN_EXPIRY'))
    },
    refreshToken: {
      secret: getEnvVar('JWT_REFRESH_TOKEN_SECRET'),
      expiry: Number(getEnvVar('JWT_REFRESH_TOKEN_EXPIRY'))
    }
  }
};

export default config;
