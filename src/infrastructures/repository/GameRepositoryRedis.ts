import { inject, injectable } from 'tsyringe';
import GameRepository from '../../domains/game/GameRepository';
import Redis from 'ioredis';
import Game from '../../domains/game/entities/Game';
import { DITokens } from '../../commons/DITokens';

@injectable()
export default class GameRepositoryRedis implements GameRepository {
  private readonly REDIS_ITEM_KEY = 'game';
  private readonly TTL_SECONDS = 3600;

  constructor(
    @inject(DITokens.RedisClient) private readonly redis: Redis
  ) {}
  
  async save(game: Game): Promise<void> {
    await this.redis.setex(
      `${this.REDIS_ITEM_KEY}:${game.id}`,
      this.TTL_SECONDS,
      JSON.stringify(game)
    );
  }

  async findById(gameId: string): Promise<Game | null> {
    const data = await this.redis.get(`${this.REDIS_ITEM_KEY}:${gameId}`);
    return data 
      ? (JSON.parse(data) as Game) 
      : null;
  }

  async delete(gameId: string): Promise<void> {
    await this.redis.del(`${this.REDIS_ITEM_KEY}:${gameId}`);
  }
}
