import 'reflect-metadata';

import RedisTokenStore from '../RedisTokenStore';
import redisClient from '../../../database/redis/redisClient';

describe('RedisTokenStore', () => {
  const redis = redisClient;
  const store = new RedisTokenStore(redis);
  const userId = 'user-123';
  const token = 'sample-refresh-token';
  const ttlSeconds = 60;

  afterAll(async () => {
    await redis.del(`refresh:${userId}`);
    await store['redis'].quit();
  });

  describe('storeRefreshToken', () => {
    it('should store token', async () => {
      await store.storeRefreshToken(userId, token, ttlSeconds);
      
      const stored = await redis.get(`refresh:${userId}`);

      expect(stored).toBe(token);
    });

    it('should expire after TTL', async () => {
      const ttlTestlUser = 'user-1-sec';
      const testTtl = 1;

      await store.storeRefreshToken(ttlTestlUser, token, testTtl);
      await new Promise((r) => setTimeout(r, 1100));
      
      const stored = await redis.get(`refresh:${ttlTestlUser}`);

      expect(stored).toBeNull();
    });
  });

  describe('verifyStoredRefreshToken', () => {
    it('should succeed if token matches', async () => {
      await redis.set(`refresh:${userId}`, token);      
      const result = await store.verifyStoredRefreshToken(userId, token);
      expect(result).toBe(true);
    });

    it('should fail if token is wrong', async () => {
      await redis.set(`refresh:${userId}`, token);
      const result = await store.verifyStoredRefreshToken(userId, 'wrong-token');
      expect(result).toBe(false);
    });

    it('should fail if token is missing', async () => {
      await redis.del(`refresh:${userId}`);
      const result = await store.verifyStoredRefreshToken(userId, token);
      expect(result).toBe(false);
    });
  });

  describe('deleteRefreshToken', () => {
    it('should delete token', async () => {
      await redis.set(`refresh:${userId}`, token);
      await store.deleteRefreshToken(userId);

      const result = await redis.get(`refresh:${userId}`);

      expect(result).toBeNull();
    });
  });
});
