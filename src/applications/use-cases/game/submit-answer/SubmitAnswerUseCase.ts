import { InvariantError, NotFoundError } from '../../../../commons/exceptions';
import GameRepository from '../../../../domains/game/GameRepository';
import { SubmitAnswerCmd } from './command/SubmitAnswerCmd';
import { SubmitAnswerDTO } from './dto/SubmitAnswerDTO';

export default class SubmitAnswerUseCase {
  constructor(private readonly gameRepository: GameRepository) {}

  async execute(cmd: SubmitAnswerCmd): Promise<SubmitAnswerDTO> {
    const game = await this.gameRepository.findById(cmd.gameId);

    if (!game) throw new NotFoundError("Game expired or not found");

    const questionNoun = game.nouns.find((n) => n.id === cmd.nounId);

    if (!questionNoun) throw new InvariantError("Noun is not found in the game set");

    const isCorrect = (questionNoun.gender === cmd.answer);

    if (isCorrect) {
      game.incrementPoints();
      await this.gameRepository.save(game);
    }

    return {
      correct: isCorrect,
      currentScore: game.points
    } satisfies SubmitAnswerDTO;
  }
}
