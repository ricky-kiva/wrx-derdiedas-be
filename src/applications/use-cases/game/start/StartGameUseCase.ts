import Game from '../../../../domains/game/entities/Game';
import GameRepository from '../../../../domains/game/GameRepository';
import Noun from '../../../../domains/noun/entities/Noun';
import NounQueryRepository from '../../../query-repositories/noun/NounQueryRepository';
import { StartGameDTO } from './dto/StartGameDTO';

export default class StartGameUseCase {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly nounQueryRepository: NounQueryRepository
  ) {}

  async execute(userId?: string): Promise<StartGameDTO> {
    const gameId = `game-${crypto.randomUUID()}`;

    const randomNouns = await this.nounQueryRepository.getRandom();

    const nouns = randomNouns.map((n) => ({
      id: n.id,
      gender: n.gender
    } satisfies Omit<Noun, ('meanings' | 'word')>));

    const game = new Game({
      userId,
      nouns,
      id: gameId
    });

    await this.gameRepository.save(game);

    return {
      gameId,
      nouns: randomNouns.map(({ id, word, meanings }) => ({ id, word, meanings }))
    } satisfies StartGameDTO;
  }
}
