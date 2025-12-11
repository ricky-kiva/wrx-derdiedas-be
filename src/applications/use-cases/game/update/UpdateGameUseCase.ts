import { NotFoundError } from '../../../../commons/exceptions';
import Game from '../../../../domains/game/entities/Game';
import GameRepository from '../../../../domains/game/GameRepository';
import UserRepository from '../../../../domains/user/UserRepository';
import GameTokenManager from '../../../ports/security/GameTokenManager';
import { UpdateGameCmd } from './commands/UpdateGameCmd';
import { UpdateGameDTO } from './dto/UpdateGameDTO';

export default class UpdateGameUseCase {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly gameTokenManager: GameTokenManager,
    private readonly userRepository: UserRepository
  ) {}

  async execute(cmd: UpdateGameCmd): Promise<UpdateGameDTO> {
    this.gameTokenManager.verifyGameToken(cmd.gameToken);
    this.gameTokenManager.verifyPayload(cmd.gameToken);

    const gameData = await this.gameRepository.findById(cmd.id);

    if (!gameData) throw new NotFoundError('Game not found');

    if (cmd.payload.userId) {
      const user = await this.userRepository.findById(cmd.payload.userId);
      if (!user) throw new NotFoundError('User not found');
    }

    const existing = new Game(gameData);

    const updated = new Game({ ...existing, ...cmd.payload });

    await this.gameRepository.save(updated);

    return {
      id: updated.id,
      userId: updated.userId,
      points: updated.points,
      nouns: updated.nouns.map(({ id, word, meanings }) => ({ id, word, meanings }))
    } satisfies UpdateGameDTO;
  }
}
