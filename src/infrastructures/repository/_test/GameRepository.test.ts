import 'reflect-metadata';

import GameRepositoryRedis from '../GameRepositoryRedis';
import Game from '../../../domains/game/entities/Game';
import redisClient from '../../database/redis/redisClient';

describe('GameRepositoryRedis (real Redis)', () => {
  let repository: GameRepositoryRedis;

  beforeEach(async () => {
    repository = new GameRepositoryRedis(redisClient);
    await redisClient.flushall();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it('should save and find a game by id', async () => {
    const game = new Game({
      id: 'game-123',
      userId: 'user-123',
      nouns: [],
    });

    await repository.save(game);
    const found = await repository.findById('game-123');

    expect(found).not.toBeNull();
    expect(found?.id).toBe('game-123');
    expect(found?.userId).toBe('user-123');
  });

  it('should return null if game does not exist', async () => {
    const result = await repository.findById('non-existent');
    expect(result).toBeNull();
  });

  it('should delete a game from Redis', async () => {
    const game = new Game({
      id: 'game-234',
      userId: 'user-234',
      nouns: [],
    });

    await repository.save(game);
    await repository.delete('game-234');

    const result = await repository.findById('game-234');
    expect(result).toBeNull();
  });
});
