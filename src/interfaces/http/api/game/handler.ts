import { inject, injectable } from 'tsyringe';
import { DITokens } from '../../../../commons/DITokens';
import StartGameUseCase from '../../../../applications/use-cases/game/start/StartGameUseCase';
import SubmitAnswerUseCase from '../../../../applications/use-cases/game/submit-answer/SubmitAnswerUseCase';
import { Request, Response } from 'express';
import HeaderUtils from '../../shared/HeaderUtils';
import ApiResponse from '../../types/ApiResponse';
import { SubmitAnswerPayloadSchema } from '../../adapters/validation/game/schemas';

@injectable()
export default class GameHandler {
  constructor(
    @inject(DITokens.StartGameUseCase)
    private readonly startGameUseCase: StartGameUseCase,
    @inject(DITokens.SubmitAnswerUseCase)
    private readonly submitAnswerUseCase: SubmitAnswerUseCase,
    @inject(DITokens.HeaderUtils)
    private readonly headerUtils: HeaderUtils
  ) {
    this.startGame = this.startGame.bind(this);
    this.submitAnswer = this.submitAnswer.bind(this);
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
