import { InvariantError, NotFoundError } from '../../../../commons/exceptions';
import Game from '../../../../domains/game/entities/Game';
import GameRepository from '../../../../domains/game/GameRepository';
import { USER_POINT_CONSTANTS } from '../../../../domains/userPoint/constants/userPointConstancts';
import { SubmitAnswerCmd } from './command/SubmitAnswerCmd';
import { SubmitAnswerDTO } from './dto/SubmitAnswerDTO';

export default class SubmitAnswerUseCase {
  constructor(private readonly gameRepository: GameRepository) {}

  async execute(cmd: SubmitAnswerCmd): Promise<SubmitAnswerDTO> {
    const gameData = await this.gameRepository.findById(cmd.gameId);

    if (!gameData) throw new NotFoundError("Game expired or not found");

    const game = new Game(gameData);

    const questionIndex = game.nouns.findIndex((n) => n.id === cmd.nounId);

    if (questionIndex === -1) throw new InvariantError("Noun is not found in the game set");

    const questionNoun = game.nouns[questionIndex];
    const isCorrect = (questionNoun.gender === cmd.answer);

    game.nouns.splice(questionIndex, 1);

    if (isCorrect) game.incrementPoints(USER_POINT_CONSTANTS.INCREMENT_POINT);

    await this.gameRepository.save(game);

    return {
      correct: isCorrect,
      currentScore: game.points
    } satisfies SubmitAnswerDTO;
  }
}
