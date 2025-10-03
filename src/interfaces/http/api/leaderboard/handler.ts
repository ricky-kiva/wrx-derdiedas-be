import { inject, injectable } from 'tsyringe';
import { DITokens } from '../../../../commons/DITokens';
import GetLeaderboardUseCase from '../../../../applications/use-cases/leaderboard/get/GetLeaderboardUseCase';
import { Request, Response } from 'express';
import { GetLeaderboardQPSchema, SubmitPointPayloadSchema } from '../../adapters/validation/leaderboard/schemas';
import ApiResponse from '../../types/ApiResponse';
import SubmitPointUseCase from '../../../../applications/use-cases/leaderboard/submit-point/SubmitPointUseCase';

@injectable()
export default class LeaderboardHandler {
  constructor(
    @inject(DITokens.GetLeaderboardUseCase)
    private readonly getLeaderboardUseCase: GetLeaderboardUseCase,
    @inject(DITokens.SubmitPointUseCase)
    private readonly submitPointUseCase: SubmitPointUseCase
  ) {
    this.getLeaderboard = this.getLeaderboard.bind(this);
    this.submitPoint = this.submitPoint.bind(this);
  }

  async getLeaderboard(req: Request, res: Response) {
    const q = GetLeaderboardQPSchema.parse(req.query);

    const leaderboard = await this.getLeaderboardUseCase.execute(q);

    res.json({
      status: 'success',
      data: leaderboard
    } satisfies ApiResponse);
  }

  async submitPoint(req: Request, res: Response) {
    const p = SubmitPointPayloadSchema.parse(req.body);

    const userId = await this.submitPointUseCase.execute(p);

    res.json({
      status: 'success',
      data: { userId }
    } satisfies ApiResponse);
  }
}
