import Game from '../../../../domains/game/entities/Game';
import GameRepository from '../../../../domains/game/GameRepository';
import GameTokenManager from '../../../ports/security/GameTokenManager';
import NounQueryRepository from '../../../query-repositories/noun/NounQueryRepository';
import { StartGameDTO } from './dto/StartGameDTO';

export default class StartGameUseCase {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly gameTokenManager: GameTokenManager,
    private readonly nounQueryRepository: NounQueryRepository
  ) {}

  async execute(gameToken: string, userId?: string): Promise<StartGameDTO> {
    this.gameTokenManager.verifyGameToken(gameToken);
    this.gameTokenManager.verifyPayload(gameToken);

    const id = crypto.randomUUID();

    const randomNouns = await this.nounQueryRepository.getRandom();

    const game = new Game({
      id,
      userId,
      nouns: randomNouns
    });

    await this.gameRepository.save(game);

    return {
      id,
      nouns: randomNouns.map(({ id, word, meanings }) => ({ id, word, meanings }))
    } satisfies StartGameDTO;
  }
}
