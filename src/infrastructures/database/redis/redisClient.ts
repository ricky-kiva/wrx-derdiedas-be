import Redis from 'ioredis';
import config from '../../../commons/config';

const redisClient = new Redis({
  db: config.database.redis.database,
  password: config.database.redis.password
});

export default redisClient;
