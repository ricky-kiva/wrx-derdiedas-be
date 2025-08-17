import { Model } from 'mongoose';
import { PagedDTO } from '../../applications/shared/dto/PagedDTO';
import { LeaderboardEntryDTO } from '../../applications/use-cases/leaderboard/dto/LeaderboardEntryDTO';
import LeaderboardQueryRepository from '../../applications/use-cases/leaderboard/LeaderboardQueryRepository';
import { DITokens } from '../../commons/DITokens';
import { inject, injectable } from 'tsyringe';
import { UserPointDocument } from '../database/mongoose/models/UserPointModel';

@injectable()
export class LeaderboardQueryRepositoryMongo implements LeaderboardQueryRepository {
  constructor(
      @inject(DITokens.UserPointModel) private readonly model: Model<UserPointDocument>
    ) {}
  
  async getLeaderboard(page: number, limit: number): Promise<PagedDTO<LeaderboardEntryDTO>> {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.model.aggregate<LeaderboardEntryDTO>([
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            _id: 0,
            name: '$user.name',
            point: 1,
            updatedAt: 1
          }
        },
        {
          $sort: {
            point: -1, 
            updatedAt: -1
          }
        },
        { $skip: skip },
        { $limit: limit }
      ]),
      this.model.countDocuments()
    ]);

    return {
      items,
      page,
      totalPages: Math.ceil(total / limit)
    } satisfies PagedDTO<LeaderboardEntryDTO>;
  }
}
