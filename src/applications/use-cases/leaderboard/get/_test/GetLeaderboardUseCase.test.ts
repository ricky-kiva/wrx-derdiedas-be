import LeaderboardQueryRepository from '../../../../query-repositories/leaderboard/LeaderboardQueryRepository';
import { PagedDTO } from '../../../../shared/dto/PagedDTO';
import { LeaderboardEntryDTO } from '../dto/LeaderboardEntryDTO';
import GetLeaderboardUseCase from '../GetLeaderboardUseCase';
import GetLeaderboardQ from '../query/GetLeaderboardQ';

describe('GetLeaderboardUseCase', () => {
  it('should return leaderboard with given limit', async () => {
    const q: GetLeaderboardQ = { page: 2, limit: 10 };
    
    const mockResult: PagedDTO<LeaderboardEntryDTO> = {
      items: [
        { name: 'Rickyslash', point: 100, updatedAt: new Date() },
        { name: 'Rezy', point: 150, updatedAt: new Date() }
      ],
      page: q.page,
      totalPages: Math.ceil(q.limit/q.page)
    };

    const mockGLeaderboardMethod = jest.fn().mockResolvedValue(mockResult);

    const mockLeaderboardQRepo: jest.Mocked<LeaderboardQueryRepository> = {
      getLeaderboard: mockGLeaderboardMethod
    } as Partial<jest.Mocked<LeaderboardQueryRepository>> as jest.Mocked<LeaderboardQueryRepository>;

    const getLeaderboardUC = new GetLeaderboardUseCase(mockLeaderboardQRepo);

    const result = await getLeaderboardUC.execute(q);

    expect(result).toStrictEqual(mockResult);
    expect(mockGLeaderboardMethod).toHaveBeenCalledWith(q.page, q.limit);
  });
});
