import { NotFoundError } from '../../../../commons/exceptions';
import Game from '../../../../domains/game/entities/Game';
import GameRepository from '../../../../domains/game/GameRepository';
import { UpdateGameCmd } from './commands/UpdateGameCmd';
import { UpdateGameDTO } from './dto/UpdateGameDTO';

export default class UpdateGameUseCase {
  constructor(private readonly gameRepository: GameRepository) {}

  async execute(cmd: UpdateGameCmd): Promise<UpdateGameDTO> {
    const gameData = await this.gameRepository.findById(cmd.id);

    if (!gameData) throw new NotFoundError('Game not found');

    const existing = new Game(gameData);

    const updated = new Game({ ...existing, ...cmd.payload });

    await this.gameRepository.save(updated);

    return updated satisfies UpdateGameDTO;
  }
}
