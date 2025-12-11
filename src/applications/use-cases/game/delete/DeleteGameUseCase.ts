import { NotFoundError } from '../../../../commons/exceptions';
import GameRepository from '../../../../domains/game/GameRepository';
import GameTokenManager from '../../../ports/security/GameTokenManager';

export default class DeleteGameUseCase {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly gameTokenManager: GameTokenManager
  ) {}

  async execute(gameToken: string, gameId: string): Promise<void> {
    this.gameTokenManager.verifyGameToken(gameToken);
    this.gameTokenManager.verifyPayload(gameToken);

    const game = await this.gameRepository.findById(gameId);

    if (!game) throw new NotFoundError('Game not found');

    await this.gameRepository.delete(gameId);
  }
}
