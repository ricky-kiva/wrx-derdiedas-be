import Redis from 'ioredis';
import TokenStore from '../../../applications/ports/security/TokenStore';
import { InvariantError } from '../../../commons/exceptions';
import config from '../../../commons/config';

export default class RedisTokenStore implements TokenStore {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({ 
      db: config.database.redis.database,
      password: config.database.redis.password
    });
  }

  async storeRefreshToken(userId: string, token: string, ttlSeconds: number): Promise<void> {
    await this.redis.set(`refresh:${userId}`, token, 'EX', ttlSeconds);
  }

  async verifyRefreshToken(userId: string, token: string): Promise<void> {
    const stored = await this.redis.get(`refresh:${userId}`);
    if (stored !== token) throw new InvariantError('Refresh token is invalid');
  }

  async deleteRefreshToken(userId: string): Promise<void> {
    await this.redis.del(`refresh:${userId}`);
  }
}
