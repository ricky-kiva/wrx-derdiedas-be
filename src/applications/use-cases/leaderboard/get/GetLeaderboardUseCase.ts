import { LeaderboardEntryDTO } from './dto/LeaderboardEntryDTO';
import LeaderboardQueryRepository from '../../../query-repositories/leaderboard/LeaderboardQueryRepository';
import { PagedDTO } from '../../../shared/dto/PagedDTO';
import GetLeaderboardQ from './query/GetLeaderboardQ';

export default class GetLeaderboardUseCase {
  constructor(private readonly leaderboardQueryRepository: LeaderboardQueryRepository) {}

  async execute(q: GetLeaderboardQ): Promise<PagedDTO<LeaderboardEntryDTO>> {
    return this.leaderboardQueryRepository.getLeaderboard(q.page, q.limit);
  }
}
