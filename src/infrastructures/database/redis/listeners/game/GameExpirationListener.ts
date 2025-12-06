import { inject, injectable } from 'tsyringe';
import { DITokens } from '../../../../../commons/DITokens';
import Redis from 'ioredis';
import UserPointRepository from '../../../../../domains/userPoint/UserPointRepository';
import GameRepository from '../../../../../domains/game/GameRepository';
import config from '../../../../../commons/config';

@injectable()
export default class GameExpirationListener {
  constructor(
    @inject(DITokens.RedisClient) private readonly redis: Redis,
    @inject(DITokens.UserPointRepository) private readonly userPointRepository: UserPointRepository,
    @inject(DITokens.GameRepository) private readonly gameRepository: GameRepository
  ) {}

  async start () {
    await this.redis.config('SET', 'notify-keyspace-events', 'Ex');

    const sub = new Redis({
      host: config.database.redis.host,
      port: config.database.redis.port,
      db: config.database.redis.database,
      password: config.database.redis.password
    });

    const channel = '__keyevent@0__:expired';

    await sub.subscribe(channel);

    console.log('Listening for expired game..');

    sub.on('message', (_, key) => {
      if (!key.startsWith('game:')) return;

      const gameId = key.split(':')[1];
      
      this.gameRepository.findById(gameId)
        .then(game => {
          if (!game?.userId) return;
          return this.userPointRepository.increment(game.userId, game.points);
        })
        .catch(err => console.error('Error handling expired game:', err));
    });
  }
}
