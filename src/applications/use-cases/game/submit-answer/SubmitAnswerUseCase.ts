import { InvariantError, NotFoundError } from '../../../../commons/exceptions';
import GameRepository from '../../../../domains/game/GameRepository';
import { SubmitAnswerCmd } from './command/SubmitAnswerCmd';
import { SubmitAnswerDTO } from './dto/SubmitAnswerDTO';

export default class SubmitAnswerUseCase {
  constructor(private readonly gameRepository: GameRepository) {}

  async execute(cmd: SubmitAnswerCmd): Promise<SubmitAnswerDTO> {
    const game = await this.gameRepository.findById(cmd.gameId);

    if (!game) throw new NotFoundError("Game expired or not found");

    const questionIndex = game.nouns.findIndex((n) => n.id === cmd.nounId);

    if (questionIndex === -1) throw new InvariantError("Noun is not found in the game set");

    const questionNoun = game.nouns[questionIndex];
    const isCorrect = (questionNoun.gender === cmd.answer);

    game.nouns.splice(questionIndex, 1);

    if (isCorrect) game.incrementPoints();

    await this.gameRepository.save(game);

    return {
      correct: isCorrect,
      currentScore: game.points
    } satisfies SubmitAnswerDTO;
  }
}
