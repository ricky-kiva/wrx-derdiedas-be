import Redis from 'ioredis';
import config from '../../../commons/config';

const redisClient = new Redis({
  host: config.database.redis.host,
  port: config.database.redis.port,
  db: config.database.redis.database,
  password: config.database.redis.password
});

export default redisClient;
