import { Application } from 'express';
import request from 'supertest';
import ApiResponse from '../../../../../interfaces/http/types/ApiResponse';
import { TestPartMocks } from '../mocks/useCases.mock.test.part';
import { SubmitAnswerCmd } from '../../../../../applications/use-cases/game/submit-answer/command/SubmitAnswerCmd';
import { SubmitAnswerDTO } from '../../../../../applications/use-cases/game/submit-answer/dto/SubmitAnswerDTO';
import NounsCollectionTestHelper from '../../../../../../tests/NounsCollectionTestHelper';
import { NotFoundError, InvariantError } from '../../../../../commons/exceptions';
import HeaderUtils from '../../../../../interfaces/http/shared/HeaderUtils';

export default function testGameRoutes(
  getApp: () => Application,
  getMocks: () => TestPartMocks
) {
  const BASE_URL = '/game';

  describe('Game Routes Integration', () => {
    let app: Application;
    let mocks: TestPartMocks;

    beforeEach(() => {
      app = getApp();
      mocks = getMocks();

      jest.spyOn(HeaderUtils.prototype, 'extractUserId').mockImplementation(
        (): (string | undefined) => undefined
      );
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe('POST `/game/end`', () => {
      it('responds with 200 and userId when game ends successfully (logged-in user)', async () => {
        const mockUserId = 'user-123';
        const mockGameId = 'game-123';

        (HeaderUtils.prototype.extractUserId as jest.Mock).mockImplementation(
          (): string | undefined => mockUserId
        );

        mocks.usecases.endGameUC.execute.mockResolvedValue(mockUserId);

        const res = await request(app)
          .post(`${BASE_URL}/end`)
          .send({ gameId: mockGameId });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          status: 'success',
          data: { userId: mockUserId }
        } satisfies ApiResponse);

        expect(mocks.methods.endGameUC.execute).toHaveBeenCalledWith({
          gameId: mockGameId
        });
      });

      it('responds with 200 and new userId when anonymous user ends game with name', async () => {
        const mockGameId = 'game-456';
        const mockNonRegUserId = 'user-123';
        const name = 'Player123';

        mocks.usecases.endGameUC.execute.mockResolvedValue(mockNonRegUserId);

        const res = await request(app)
          .post(`${BASE_URL}/end`)
          .send({ gameId: mockGameId, name });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          status: 'success',
          data: { userId: mockNonRegUserId }
        } satisfies ApiResponse);

        expect(mocks.methods.endGameUC.execute).toHaveBeenCalledWith({
          gameId: mockGameId,
          userId: undefined,
          name
        });
      });

      it('responds with 404 if game not found', async () => {
        mocks.usecases.endGameUC.execute.mockRejectedValue(
          new NotFoundError('Game not found')
        );

        const res = await request(app)
          .post(`${BASE_URL}/end`)
          .send({ gameId: 'missing-game' });

        expect(res.status).toBe(404);
        expect(res.body).toMatchObject({
          status: 'fail',
          message: 'Game not found'
        });
      });

      it('responds with 400 if anonymous user does not provide name', async () => {
        mocks.usecases.endGameUC.execute.mockRejectedValue(
          new InvariantError('Name is required for guest users')
        );

        const res = await request(app)
          .post(`${BASE_URL}/end`)
          .send({ gameId: 'game-789' });

        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({
          status: 'fail',
          message: expect.any(String) as unknown as string
        });
      });

      it('responds with 500 if an unexpected error occurs', async () => {
        mocks.usecases.endGameUC.execute.mockRejectedValue(new Error('Unexpected'));

        const res = await request(app)
          .post(`${BASE_URL}/end`)
          .send({ gameId: 'game-500' });

        expect(res.status).toBe(500);
        expect((res.body as ApiResponse).status).toBe('error');
      });
    });


    describe('POST `/game/start`', () => {
      it('responds with 200 and StartGameDTO (anonymous)', async () => {
        const testNouns = Object.values(NounsCollectionTestHelper.getNouns())
          .map(({ id, word, meanings }) => ({ id, word, meanings }));

        const mockGameResult = {
          gameId: 'game-123',
          nouns: testNouns
        };

        mocks.usecases.startGameUC.execute.mockResolvedValue(mockGameResult);

        const res = await request(app).post(`${BASE_URL}/start`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          status: 'success',
          data: mockGameResult
        } satisfies ApiResponse);

        expect(mocks.methods.startGameUC.execute).toHaveBeenCalledWith(undefined);
      });

      it('responds with 200 when user is logged in', async () => {
        const userId = 'user-123';

        (HeaderUtils.prototype.extractUserId as jest.Mock).mockImplementation(
          (): (string | undefined) => userId
        );

        const mockGameResult = {
          gameId: 'game-999',
          nouns: []
        };

        mocks.usecases.startGameUC.execute.mockResolvedValue(mockGameResult);

        const res = await request(app)
          .post(`${BASE_URL}/start`)
          .set('Authorization', `Bearer token-for-${userId}`);

        expect(res.status).toBe(200);
        expect((res.body as ApiResponse).status).toBe('success');

        expect(mocks.methods.startGameUC.execute).toHaveBeenCalledWith(userId);
      });

      it('responds with 500 if use case throws an unexpected error', async () => {
        mocks.usecases.startGameUC.execute.mockRejectedValue(new Error('Unexpected'));

        const res = await request(app).post(`${BASE_URL}/start`);

        expect(res.status).toBe(500);
        expect((res.body as ApiResponse).status).toBe('error');
      });
    });

    describe('POST `/game/answer`', () => {
      it('responds with 200 and SubmitAnswerDTO (valid payload)', async () => {
        const payload: SubmitAnswerCmd = {
          gameId: 'game-123',
          nounId: 'noun-101',
          answer: 'feminine',
        };

        const mockResult: SubmitAnswerDTO = {
          correct: true,
          currentScore: 10
        };

        mocks.usecases.submitAnswerUC.execute.mockResolvedValue(mockResult);

        const res = await request(app)
          .post(`${BASE_URL}/answer`)
          .send(payload);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          status: 'success',
          data: mockResult
        } satisfies ApiResponse);

        expect(mocks.methods.submitAnswerUC.execute).toHaveBeenCalledWith(payload);
      });

      it('responds with 404 if game not found', async () => {
        const payload: SubmitAnswerCmd = {
          gameId: 'invalid-game',
          nounId: 'noun-101',
          answer: 'feminine'
        };

        mocks.usecases.submitAnswerUC.execute.mockRejectedValue(
          new NotFoundError('Game not found')
        );

        const res = await request(app)
          .post(`${BASE_URL}/answer`)
          .send(payload);

        expect(res.status).toBe(404);
        expect(res.body).toMatchObject({
          status: 'fail',
          message: 'Game not found'
        });
      });

      it('responds with 400 if noun not found in game', async () => {
        const payload: SubmitAnswerCmd = {
          gameId: 'game-1',
          nounId: 'noun-missing',
          answer: 'masculine'
        };

        mocks.usecases.submitAnswerUC.execute.mockRejectedValue(
          new InvariantError('Noun not found')
        );

        const res = await request(app)
          .post(`${BASE_URL}/answer`)
          .send(payload);

        expect(res.status).toBe(400);
        expect(res.body).toMatchObject({
          status: 'fail',
          message: 'Noun not found'
        });
      });

      it('responds with 400 for invalid payload', async () => {
        const invalidPayload = { gameId: '', nounId: 'noun-101' };

        const res = await request(app)
          .post(`${BASE_URL}/answer`)
          .send(invalidPayload);

        expect(res.status).toBe(400);
        expect((res.body as ApiResponse).status).toBe('fail');
      });
    });
  });
}
