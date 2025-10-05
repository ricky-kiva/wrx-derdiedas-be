import Game from '../../../../domains/game/entities/Game';
import GameRepository from '../../../../domains/game/GameRepository';
import NounQueryRepository from '../../../query-repositories/noun/NounQueryRepository';
import { StartGameDTO } from './dto/StartGameDTO';

export default class StartGameUseCase {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly nounQueryRepository: NounQueryRepository
  ) {}

  async execute(userId: string): Promise<StartGameDTO> {
    const gameId = `game-${crypto.randomUUID()}`;

    const randomNouns = await this.nounQueryRepository.getRandom();

    await this.gameRepository.save({
      userId,
      id: gameId,
      nouns: randomNouns,
    } satisfies Game);

    return {
      gameId,
      nouns: randomNouns.map(({ id, word, meanings }) => ({ id, word, meanings }))
    } satisfies StartGameDTO;
  }
}
