import { InvariantError, NotFoundError } from '../../../../commons/exceptions';
import GameRepository from '../../../../domains/game/GameRepository';
import UserRepository from '../../../../domains/user/UserRepository';
import UserPointRepository from '../../../../domains/userPoint/UserPointRepository';
import { EndGameCmd } from './commands/EndGameCmd';

export default class EndGameUseCase {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly userPointRepository: UserPointRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(cmd: EndGameCmd): Promise<string> {
    const game = await this.gameRepository.findById(cmd.gameId);

    if (!game) throw new NotFoundError('Game not found');
    
    await this.gameRepository.delete(cmd.gameId);

    if (game.userId) {
      const user = await this.userRepository.findById(game.userId);

      if (!user) throw new NotFoundError('User not found');

      await this.userPointRepository.increment(user.id, game.points);
      
      return user.id;
    }

    if (!cmd.name) throw new InvariantError('Name is required for guest users');

    const newAnonymousUser = await this.userRepository.create({ name: cmd.name });

    await this.userPointRepository.save({
      userId: newAnonymousUser.id,
      point: game.points,
      updatedAt: new Date()
    });

    return newAnonymousUser.id;
  }
}
