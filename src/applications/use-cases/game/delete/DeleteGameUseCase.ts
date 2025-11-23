import { NotFoundError } from '../../../../commons/exceptions';
import GameRepository from '../../../../domains/game/GameRepository';

export default class DeleteGameUseCase {
  constructor(private readonly gameRepository: GameRepository) {}

  async execute(gameId: string): Promise<void> {
    const game = await this.gameRepository.findById(gameId);

    if (!game) throw new NotFoundError('Game not found');

    await this.gameRepository.delete(gameId);
  }
}
