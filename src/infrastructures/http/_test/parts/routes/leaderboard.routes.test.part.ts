import { Application } from 'express';
import request from 'supertest';
import { LeaderboardEntryDTO } from '../../../../../applications/use-cases/leaderboard/get/dto/LeaderboardEntryDTO';
import ApiResponse from '../../../../../interfaces/http/types/ApiResponse';
import { TestPartMocks } from '../mocks/useCases.mock.test.part';

export default function testLeaderboardRoutes(
  getApp: () => Application,
  getMocks: () => TestPartMocks
) {
  describe('Leaderboard Routes Integration', () => {
    let app: Application;
    let mocks: TestPartMocks;

    beforeEach(() => {
      app = getApp();
      mocks = getMocks();
    });

    it('responds to GET `/leaderboard` with leaderboard data', async () => {
      const QUERY_PAGE = 1;
      const QUERY_LIMIT = 10;

      const mockLeaderboard: LeaderboardEntryDTO[] = [
        { name: 'Rezy', point: 100, updatedAt: new Date() },
        { name: 'Ricky', point: 90, updatedAt: new Date() }
      ];

      mocks.usecases.getLeaderboardUC.execute.mockResolvedValue({
        items: mockLeaderboard,
        page: 1,
        totalPages: 1
      });

      const res = await request(app).get(`/leaderboard?page=${QUERY_PAGE}&limit=${QUERY_LIMIT}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: 'success',
        data: {
          items: mockLeaderboard.map((i) => ({ 
            ...i, 
            updatedAt: i.updatedAt.toISOString()
          })),
          page: 1,
          totalPages: 1
        }
      } satisfies ApiResponse);
    });

    it('responds with 400 if page query is invalid', async () => {
      const res = await request(app).get('/leaderboard?page=abc');

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        status: 'fail',
        message: expect.any(String) as unknown as string
      } satisfies ApiResponse);
    });

    it('responds with default page and limit if no query parameters are provided', async () => {
      const mockLeaderboard: LeaderboardEntryDTO[] = [
        { name: 'Rezy', point: 100, updatedAt: new Date() },
        { name: 'Ricky', point: 90, updatedAt: new Date() }
      ];

      mocks.usecases.getLeaderboardUC.execute.mockResolvedValue({
        items: mockLeaderboard,
        page: 1,
        totalPages: 1
      });

      const res = await request(app).get('/leaderboard');

      expect(res.status).toBe(200);
      expect(mocks.methods.getLeaderboardUC.execute).toHaveBeenCalledWith(1, 25);
      expect(res.body).toEqual({
        status: 'success',
        data: {
          items: mockLeaderboard.map(i => ({
            ...i,
            updatedAt: i.updatedAt.toISOString()
          })),
          page: 1,
          totalPages: 1
        }
      } satisfies ApiResponse);
    });
  });
}
