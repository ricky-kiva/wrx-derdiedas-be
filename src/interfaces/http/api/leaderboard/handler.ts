import { inject, injectable } from 'tsyringe';
import { DITokens } from '../../../../commons/DITokens';
import GetLeaderboardUseCase from '../../../../applications/use-cases/leaderboard/get/GetLeaderboardUseCase';
import { Request, Response } from 'express';
import { GetLeaderboardQuerySchema } from '../../adapters/validation/leaderboard/schemas';
import ApiResponse from '../../types/ApiResponse';

@injectable()
export default class LeaderboardHandler {
  constructor(
    @inject(DITokens.GetLeaderboardUseCase)
    private readonly getLeaderboardUseCase: GetLeaderboardUseCase
  ) {
    this.getLeaderboard = this.getLeaderboard.bind(this);
  }

  async getLeaderboard(req: Request, res: Response) {
    const { page, limit } = GetLeaderboardQuerySchema.parse(req.query);

    const leaderboard = await this.getLeaderboardUseCase.execute(page, limit);

    res.json({
      status: 'success',
      data: leaderboard
    } satisfies ApiResponse);
  }
}
