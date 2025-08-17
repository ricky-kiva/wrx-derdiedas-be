import { PagedDTO } from '../../shared/dto/PagedDTO';
import { LeaderboardEntryDTO } from './dto/LeaderboardEntryDTO';

export default interface LeaderboardQueryRepository {
  getLeaderboard(page: number, limit: number): Promise<PagedDTO<LeaderboardEntryDTO>>;
}
