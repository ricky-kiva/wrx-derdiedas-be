import { InvariantError } from '../../../../commons/exceptions';
import RedisTokenStore from '../RedisTokenStore';

describe('RedisTokenStore', () => {
  const store = new RedisTokenStore();
  const redis = store['redis'];
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
      await expect(store.verifyStoredRefreshToken(userId, token)).resolves.not.toThrow();
    });

    it('should throw InvariantError if token is wrong', async () => {
      await redis.set(`refresh:${userId}`, token);
      await expect(store.verifyStoredRefreshToken(userId, 'wrong-token')).rejects.toThrow(InvariantError);
    });

    it('should throw InvariantError if token is missing', async () => {
      await redis.del(`refresh:${userId}`);
      await expect(store.verifyStoredRefreshToken(userId, token)).rejects.toThrow(InvariantError);
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
