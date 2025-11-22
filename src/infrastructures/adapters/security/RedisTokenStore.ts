import Redis from 'ioredis';
import TokenStore from '../../../applications/ports/security/TokenStore';
import config from '../../../commons/config';
import { inject, injectable } from 'tsyringe';
import { DITokens } from '../../../commons/DITokens';

@injectable()
export default class RedisTokenStore implements TokenStore {
  constructor(
    @inject(DITokens.RedisClient) private readonly redis: Redis
  ) {}

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

  async verifyStoredRefreshToken(userId: string, token: string): Promise<boolean> {
    const stored = await this.redis.get(this.refreshKey(userId));
    return stored === token;
  }

  async deleteRefreshToken(userId: string): Promise<void> {
    await this.redis.del(this.refreshKey(userId));
  }
}
