import redisClient from '../redisClient';

describe('Redis client', () => {
  afterAll(async () => {
    await redisClient.quit();
  });
  
  it('should connect to Redis', async () => {
    const pong = await redisClient.ping();
    expect(pong).toBe('PONG');
  });
});
