import { inject, injectable } from 'tsyringe';
import { DITokens } from '../../../../commons/DITokens';
import StartGameUseCase from '../../../../applications/use-cases/game/start/StartGameUseCase';
import SubmitAnswerUseCase from '../../../../applications/use-cases/game/submit-answer/SubmitAnswerUseCase';
import { Request, Response } from 'express';
import HeaderUtils from '../../shared/HeaderUtils';
import ApiResponse from '../../types/ApiResponse';
import { EndGamePayloadSchema, GameIdParamSchema, SubmitAnswerPayloadSchema, UpdateGamePayloadSchema } from '../../adapters/validation/game/schemas';
import EndGameUseCase from '../../../../applications/use-cases/game/end/EndGameUseCase';
import UpdateGameUseCase from '../../../../applications/use-cases/game/update/UpdateGameUseCase';
import GetGameByIdUseCase from '../../../../applications/use-cases/game/get/GetGameByIdUseCase';

@injectable()
export default class GameHandler {
  constructor(
    @inject(DITokens.HeaderUtils)
    private readonly headerUtils: HeaderUtils,
    @inject(DITokens.EndGameUseCase)
    private readonly endGameUseCase: EndGameUseCase,
    @inject(DITokens.GetGameByIdUseCase)
    private readonly getGameByIdUseCase: GetGameByIdUseCase,
    @inject(DITokens.StartGameUseCase)
    private readonly startGameUseCase: StartGameUseCase,
    @inject(DITokens.SubmitAnswerUseCase)
    private readonly submitAnswerUseCase: SubmitAnswerUseCase,
    @inject(DITokens.UpdateGameUseCase)
    private readonly updateGameUseCase: UpdateGameUseCase
  ) {
    this.end = this.end.bind(this);
    this.getById = this.getById.bind(this);
    this.start = this.start.bind(this);
    this.submitAnswer = this.submitAnswer.bind(this);
    this.update = this.update.bind(this);
  }

  async end(req: Request, res: Response) {
    const { id: gameId } = GameIdParamSchema.parse(req.params);
    
    const p = EndGamePayloadSchema.parse(req.body);

    const result = await this.endGameUseCase.execute({ 
      gameId, 
      name: p?.name 
    });

    res.json({
      status: 'success',
      data: { userId: result }
    } satisfies ApiResponse);
  }

  async getById(req: Request, res: Response) {
    const { id } = GameIdParamSchema.parse(req.params);

    const game = await this.getGameByIdUseCase.execute(id);

    res.json({
      status: 'success',
      data: game
    } satisfies ApiResponse);
  }

  async start(req: Request, res: Response) {
    const userId = this.headerUtils.extractUserId(req);

    const game = await this.startGameUseCase.execute(userId);

    res.json({
      status: 'success',
      data: game
    } satisfies ApiResponse);
  }

  async submitAnswer(req: Request, res: Response) {
    const { id: gameId } = GameIdParamSchema.parse(req.params);

    const p = SubmitAnswerPayloadSchema.parse(req.body);

    const result = await this.submitAnswerUseCase.execute({ gameId, ...p  });

    res.json({
      status: 'success',
      data: result
    } satisfies ApiResponse);
  }

  async update(req: Request, res: Response) {
    const { id } = GameIdParamSchema.parse(req.params);
    
    const p = UpdateGamePayloadSchema.parse(req.body);

    const updated = await this.updateGameUseCase.execute({ id, payload: p });

    res.json({
      status: 'success',
      data: updated
    } satisfies ApiResponse);
  }
}
