import dotenv from 'dotenv';
import path from 'path';

interface AppConfig {
  port: number,
  host: string
}

interface DatabaseConfig {
  host: string,
  port: number,
  database: string,
  user: string,
  password: string
}

interface ClientIdConfig {
  google: string
}

interface Config {
  app: AppConfig,
  database: DatabaseConfig,
  clientId: ClientIdConfig
}

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
  database: {
    host: getEnvVar('MONGO_HOST'),
    port: Number(getEnvVar('MONGO_PORT')),
    database: getEnvVar('MONGO_DATABASE'),
    user: getEnvVar('MONGO_USER'),
    password: getEnvVar('MONGO_PASSWORD')
  },
  clientId: {
    google: String(process.env.GOOGLE_CLIENT_ID)
  }
};

export default config;
