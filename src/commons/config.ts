import dotenv from 'dotenv';
import path from 'path';
import { Config } from './types';

const envFile = (process.env.NODE_ENV === 'test')
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
    host: process.env.NODE_ENV !== 'production'
      ? 'localhost'
      : '0.0.0.0'
  },
  clientId: {
    google: String(process.env.GOOGLE_CLIENT_ID)
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
      database: Number(getEnvVar('REDIS_DATABASE')),
      password: getEnvVar('REDIS_PASSWORD')
    }
  },
  jwt: {
    accessTokenSecret: String(process.env.JWT_ACCESS_TOKEN_SECRET),
    refreshTokenSecret: String(process.env.JWT_REFRESH_TOKEN_SECRET)
  }
};

export default config;
