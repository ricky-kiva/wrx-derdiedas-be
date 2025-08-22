import LeaderboardQueryRepository from '../../../../query-repositories/leaderboard/LeaderboardQueryRepository';
import { PagedDTO } from '../../../../shared/dto/PagedDTO';
import { LeaderboardEntryDTO } from '../dto/LeaderboardEntryDTO';
import GetLeaderboardUseCase from '../GetLeaderboardUseCase';

describe('GetLeaderboardUseCase', () => {
  it('should return leaderboard with given limit', async () => {
    const page = 2;
    const limit = 10;

    const mockResult: PagedDTO<LeaderboardEntryDTO> = {
      items: [
        { name: 'Rickyslash', point: 100, updatedAt: new Date() },
        { name: 'Rezy', point: 150, updatedAt: new Date() }
      ],
      page,
      totalPages: 5
    };

    const mockGLeaderboardMethod = jest.fn().mockResolvedValue(mockResult);

    const mockLeaderboardQRepo: jest.Mocked<LeaderboardQueryRepository> = {
      getLeaderboard: mockGLeaderboardMethod
    } as Partial<jest.Mocked<LeaderboardQueryRepository>> as jest.Mocked<LeaderboardQueryRepository>;

    const getLeaderboardUC = new GetLeaderboardUseCase(mockLeaderboardQRepo);

    const result = await getLeaderboardUC.execute(page, limit);

    expect(result).toStrictEqual(mockResult);
    expect(mockGLeaderboardMethod).toHaveBeenCalledWith(page, limit);
  });
});
