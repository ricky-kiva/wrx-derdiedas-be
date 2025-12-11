import { InvariantError, NotFoundError } from '../../../../commons/exceptions';
import Game from '../../../../domains/game/entities/Game';
import GameRepository from '../../../../domains/game/GameRepository';
import Noun from '../../../../domains/noun/entities/Noun';
import { USER_POINT_CONSTANTS } from '../../../../domains/userPoint/constants/userPointConstants';
import GameTokenManager from '../../../ports/security/GameTokenManager';
import NounQueryRepository from '../../../query-repositories/noun/NounQueryRepository';
import { SubmitAnswerCmd } from './command/SubmitAnswerCmd';
import { SubmitAnswerDTO } from './dto/SubmitAnswerDTO';

export default class SubmitAnswerUseCase {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly gameTokenManager: GameTokenManager,
    private readonly nounQueryRepository: NounQueryRepository
  ) {}

  async execute(cmd: SubmitAnswerCmd): Promise<SubmitAnswerDTO> {
    this.gameTokenManager.verifyGameToken(cmd.gameToken);
    this.gameTokenManager.verifyPayload(cmd.gameToken);

    const gameData = await this.gameRepository.findById(cmd.gameId);

    if (!gameData) throw new NotFoundError("Game expired or not found");

    const game = new Game(gameData);

    const questionIndex = game.nouns.findIndex((n) => n.id === cmd.nounId);

    if (questionIndex === -1) throw new InvariantError("Noun is not found in the game set");

    const questionNoun = game.nouns[questionIndex];
    const isCorrect = (questionNoun.gender === cmd.answer);

    game.nouns.splice(questionIndex, 1);

    if (isCorrect) game.incrementPoints(USER_POINT_CONSTANTS.INCREMENT_POINT);
    else game.decrementPoints(USER_POINT_CONSTANTS.DECREMENT_POINT);

    let nouns: Omit<Noun, 'gender'>[] | undefined;

    if (game.nouns.length === 0) {
      const randomNouns = await this.nounQueryRepository.getRandom();

      game.nouns.push(...randomNouns);

      nouns = randomNouns.map((n) => ({
        id: n.id,
        word: n.word,
        meanings: n.meanings
      }));
    }

    await this.gameRepository.save(game);

    return {
      nouns,
      correct: isCorrect,
      currentScore: game.points,
    } satisfies SubmitAnswerDTO;
  }
}
