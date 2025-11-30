import { Application } from 'express';
import request from 'supertest';
import { LeaderboardEntryDTO } from '../../../../../applications/use-cases/leaderboard/get/dto/LeaderboardEntryDTO';
import ApiResponse from '../../../../../interfaces/http/types/ApiResponse';
import { TestPartMocks } from '../mocks/useCases.mock.test.part';
import GetLeaderboardQ from '../../../../../applications/use-cases/leaderboard/get/query/GetLeaderboardQ';
import SubmitPointCmd from '../../../../../applications/use-cases/leaderboard/submit-point/command/SubmitPointCmd';
import { USER_POINT_CONSTANTS } from '../../../../../domains/userPoint/constants/userPointConstants';

export default function testLeaderboardRoutes(
  getApp: () => Application,
  getMocks: () => TestPartMocks
) {
  const BASE_URL = '/leaderboard';

  describe('Leaderboard Routes Integration', () => {
    let app: Application;
    let mocks: TestPartMocks;

    beforeEach(() => {
      app = getApp();
      mocks = getMocks();
    });

    describe('GET `leaderboard`', () => {
      it('responds with 200 and leaderboard data', async () => {
        const QUERY_PAGE = 1;
        const QUERY_LIMIT = 10;

        const mockLeaderboard: LeaderboardEntryDTO[] = [
          { id: 'user-123', rank: 1, name: 'Rezy', point: 100, updatedAt: new Date() },
          { id: 'user-124', rank: 2, name: 'Ricky', point: 90, updatedAt: new Date() }
        ];

        mocks.usecases.getLeaderboardUC.execute.mockResolvedValue({
          items: mockLeaderboard,
          page: 1,
          totalPages: 1
        });

        const res = await request(app)
          .get(`${BASE_URL}?page=${QUERY_PAGE}&limit=${QUERY_LIMIT}`);

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
        const res = await request(app).get(`${BASE_URL}?page=abc`);

        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({
          status: 'fail',
          message: expect.any(String) as unknown as string
        } satisfies ApiResponse);
      });

      it('responds with default page and limit if no query parameters are provided', async () => {
        const mockLeaderboard: LeaderboardEntryDTO[] = [
          { id: 'user-123', rank: 1, name: 'Rezy', point: 100, updatedAt: new Date() },
          { id: 'user-124', rank: 2, name: 'Ricky', point: 90, updatedAt: new Date() }
        ];

        mocks.usecases.getLeaderboardUC.execute.mockResolvedValue({
          items: mockLeaderboard,
          page: 1,
          totalPages: 1
        });

        const res = await request(app).get(BASE_URL);

        expect(res.status).toBe(200);
        expect(mocks.methods.getLeaderboardUC.execute)
          .toHaveBeenCalledWith({ page: 1, limit: 25 } satisfies GetLeaderboardQ);
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

    describe('POST `/leaderboard`', () => {
      it('responds with 200 and userId for anonymous submission', async () => {
        const payload: SubmitPointCmd = {
          name: 'A Ricky',
          point: USER_POINT_CONSTANTS.INCREMENT_POINT,
          updatedAt: new Date()
        };

        const mockUserId = 'anonymous-123';
        mocks.usecases.submitPointUC.execute.mockResolvedValue(mockUserId);

        const res = await request(app)
          .post(BASE_URL)
          .send(payload);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          status: 'success',
          data: { userId: mockUserId }
        } satisfies ApiResponse);

        expect(mocks.methods.submitPointUC.execute).toHaveBeenCalledWith(payload);
      });

      it('responds with 200 and userId for authenticated user', async () => {
        const payload: SubmitPointCmd = {
          userId: 'user-123',
          point: USER_POINT_CONSTANTS.INCREMENT_POINT,
          updatedAt: new Date()
        };

        const mockUserId = 'user-123';
        mocks.usecases.submitPointUC.execute.mockResolvedValue(mockUserId);

        const res = await request(app)
          .post(BASE_URL)
          .send(payload);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          status: 'success',
          data: { userId: mockUserId }
        } satisfies ApiResponse);

        expect(mocks.methods.submitPointUC.execute).toHaveBeenCalledWith(payload);
      });

      it('responds with 400 for invalid payload', async () => {
        const invalidPayload = { point: USER_POINT_CONSTANTS.INCREMENT_POINT };

        const res = await request(app)
          .post(BASE_URL)
          .send(invalidPayload);

        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({
          status: 'fail',
          message: expect.any(String) as unknown as string
        } satisfies ApiResponse);
      });
    });
  });
}
