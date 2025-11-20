import GameRepository from '../../../../domains/game/GameRepository';
import { GetGameByIdDTO } from './dto/GetGameByIdDTO';

export default class GetGameByIdUseCase {
  constructor(private readonly gameRepository: GameRepository) {}

  async execute(gameId: string): Promise<GetGameByIdDTO | null> {
    const game = await this.gameRepository.findById(gameId);

    if (!game) return null;

    return game satisfies GetGameByIdDTO;
  }
}
