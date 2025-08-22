import { LeaderboardEntryDTO } from './dto/LeaderboardEntryDTO';
import LeaderboardQueryRepository from '../../../query-repositories/leaderboard/LeaderboardQueryRepository';
import { PagedDTO } from '../../../shared/dto/PagedDTO';

export default class GetLeaderboardUseCase {
  constructor(private readonly leaderboardQueryRepository: LeaderboardQueryRepository) {}

  async execute(page: number, limit: number=25): Promise<PagedDTO<LeaderboardEntryDTO>> {
    return this.leaderboardQueryRepository.getLeaderboard(page, limit);
  }
}
