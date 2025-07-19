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

  private refreshKey(userId: string): string {
    return `refresh:${userId}`;
  }

  async storeRefreshToken(
    userId: string, 
    token: string, 
    ttlSeconds: number=config.jwt.refreshToken.expiry
  ): Promise<void> {
    await this.redis.set(this.refreshKey(userId), token, 'EX', ttlSeconds);
  }

  async verifyStoredRefreshToken(userId: string, token: string): Promise<void> {
    const stored = await this.redis.get(this.refreshKey(userId));
    if (stored !== token) throw new InvariantError('Refresh token is invalid');
  }

  async deleteRefreshToken(userId: string): Promise<void> {
    await this.redis.del(this.refreshKey(userId));
  }
}
