import { inject, injectable } from 'tsyringe';
import { DITokens } from '../../../../commons/DITokens';
import StartGameUseCase from '../../../../applications/use-cases/game/start/StartGameUseCase';
import SubmitAnswerUseCase from '../../../../applications/use-cases/game/submit-answer/SubmitAnswerUseCase';
import { Request, Response } from 'express';
import HeaderUtils from '../../shared/HeaderUtils';
import ApiResponse from '../../types/ApiResponse';
import { EndGamePayloadSchema, SubmitAnswerPayloadSchema } from '../../adapters/validation/game/schemas';
import EndGameUseCase from '../../../../applications/use-cases/game/end/EndGameUseCase';

@injectable()
export default class GameHandler {
  constructor(
    @inject(DITokens.HeaderUtils)
    private readonly headerUtils: HeaderUtils,
    @inject(DITokens.EndGameUseCase)
    private readonly endGameUseCase: EndGameUseCase,
    @inject(DITokens.StartGameUseCase)
    private readonly startGameUseCase: StartGameUseCase,
    @inject(DITokens.SubmitAnswerUseCase)
    private readonly submitAnswerUseCase: SubmitAnswerUseCase,
  ) {
    this.endGame = this.endGame.bind(this);
    this.startGame = this.startGame.bind(this);
    this.submitAnswer = this.submitAnswer.bind(this);
  }

  async endGame(req: Request, res: Response) {
    const p = EndGamePayloadSchema.parse(req.body);

    const result = await this.endGameUseCase.execute(p);

    res.json({
      status: 'success',
      data: { userId: result }
    } satisfies ApiResponse);
  }

  async startGame(req: Request, res: Response) {
    const userId = this.headerUtils.extractUserId(req);

    const game = await this.startGameUseCase.execute(userId);

    res.json({
      status: 'success',
      data: game
    } satisfies ApiResponse);
  }

  async submitAnswer(req: Request, res: Response) {
    const userId = this.headerUtils.extractUserId(req);
    const p = SubmitAnswerPayloadSchema.parse(req.body);

    const result = await this.submitAnswerUseCase.execute({ ...p, userId });

    res.json({
      status: 'success',
      data: result
    } satisfies ApiResponse);
  }
}
