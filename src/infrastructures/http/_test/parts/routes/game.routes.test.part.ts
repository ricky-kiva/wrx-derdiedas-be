import { Application } from 'express';
import request from 'supertest';
import ApiResponse from '../../../../../interfaces/http/types/ApiResponse';
import { TestPartMocks } from '../mocks/useCases.mock.test.part';
import { SubmitAnswerDTO } from '../../../../../applications/use-cases/game/submit-answer/dto/SubmitAnswerDTO';
import { NotFoundError, InvariantError } from '../../../../../commons/exceptions';
import HeaderUtils from '../../../../../interfaces/http/shared/HeaderUtils';
import { UpdateGameDTO } from '../../../../../applications/use-cases/game/update/dto/UpdateGameDTO';
import { UpdateGamePayload } from '../../../../../interfaces/http/adapters/validation/game/types';
import { UpdateGameCmd } from '../../../../../applications/use-cases/game/update/commands/UpdateGameCmd';

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

      jest
        .spyOn(HeaderUtils.prototype, 'extractUserId')
        .mockImplementation(() => undefined);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe('POST `/game/:id/end`', () => {
      it('responds with 200 when logged-in user ends game', async () => {
        const userId = 'user-123';
        const gameId = 'game-123';

        (HeaderUtils.prototype.extractUserId as jest.Mock).mockReturnValue(userId);

        mocks.usecases.endGameUC.execute.mockResolvedValue(userId);

        const res = await request(app)
          .post(`${BASE_URL}/${gameId}/end`)
          .send({ name: undefined });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          status: 'success',
          data: { userId }
        });

        expect(mocks.methods.endGameUC.execute).toHaveBeenCalledWith({
          gameId,
          name: undefined
        });
      });

      it('responds with 200 when anonymous user ends game with name', async () => {
        const gameId = 'game-456';
        const newUserId = 'user-456';
        const name = 'Rickyslash';

        mocks.usecases.endGameUC.execute.mockResolvedValue(newUserId);

        const res = await request(app)
          .post(`${BASE_URL}/${gameId}/end`)
          .send({ name });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          status: 'success',
          data: { userId: newUserId }
        });

        expect(mocks.methods.endGameUC.execute)
          .toHaveBeenCalledWith({ gameId, name });
      });

      it('responds with 404 if game not found', async () => {
        mocks.usecases.endGameUC.execute.mockRejectedValue(
          new NotFoundError('Game not found')
        );

        const res = await request(app)
          .post(`${BASE_URL}/missing/end`)
          .send({ name: 'A' });

        expect(res.status).toBe(404);
        expect((res.body as ApiResponse).status).toBe('fail');
      });

      it('responds with 400 if anonymous user does not provide name', async () => {
        mocks.usecases.endGameUC.execute.mockRejectedValue(
          new InvariantError('Name is required')
        );

        const res = await request(app)
          .post(`${BASE_URL}/game-123/end`)
          .send({});

        expect(res.status).toBe(400);
        expect((res.body as ApiResponse).status).toBe('fail');
      });

      it('responds with 500 for unexpected error', async () => {
        mocks.usecases.endGameUC.execute.mockRejectedValue(
          new Error('Unexpected')
        );

        const res = await request(app)
          .post(`${BASE_URL}/game-123/end`)
          .send({ name: 'Rickyslash' });

        expect(res.status).toBe(500);
        expect((res.body as ApiResponse).status).toBe('error');
      });
    });

    describe('GET `/game/:id`', () => {
      it('responds with 200 and game data', async () => {
        const gameId = 'game-123';

        const mockGame = {
          id: gameId,
          score: 10,
          nouns: [{ id: 'noun-123', gender: 'masculine' as const }]
        };

        mocks.usecases.getGameByIdUC.execute.mockResolvedValue(mockGame);

        const res = await request(app).get(`${BASE_URL}/${gameId}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          status: 'success',
          data: mockGame
        });

        expect(mocks.methods.getGameByIdUC.execute).toHaveBeenCalledWith(gameId);
      });

      it('responds with 404 if game not found', async () => {
        mocks.usecases.getGameByIdUC.execute.mockRejectedValue(
          new NotFoundError('Game not found')
        );

        const res = await request(app).get(`${BASE_URL}/missing`);

        expect(res.status).toBe(404);
        expect((res.body as ApiResponse).status).toBe('fail');
      });

      it('responds with 500 on unexpected error', async () => {
        mocks.usecases.getGameByIdUC.execute.mockRejectedValue(
          new Error('Unexpected')
        );

        const res = await request(app).get(`${BASE_URL}/game-123`);

        expect(res.status).toBe(500);
        expect((res.body as ApiResponse).status).toBe('error');
      });
    });

    describe('POST `/game/start`', () => {
      it('responds with 200 for anonymous user', async () => {
        const mockGame = { gameId: 'game-123', nouns: [] };

        mocks.usecases.startGameUC.execute.mockResolvedValue(mockGame);

        const res = await request(app).post(`${BASE_URL}/start`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          status: 'success',
          data: mockGame
        });

        expect(mocks.methods.startGameUC.execute).toHaveBeenCalledWith(undefined);
      });

      it('responds with 200 for logged-in user', async () => {
        const userId = 'user-123';

        (HeaderUtils.prototype.extractUserId as jest.Mock).mockReturnValue(userId);

        const game = { gameId: 'game-123', nouns: [] };

        mocks.usecases.startGameUC.execute.mockResolvedValue(game);

        const res = await request(app)
          .post(`${BASE_URL}/start`)
          .set('Authorization', 'Bearer x');

        expect(res.status).toBe(200);
        expect((res.body as ApiResponse).status).toBe('success');

        expect(mocks.methods.startGameUC.execute).toHaveBeenCalledWith(userId);
      });

      it('responds with 500 on unexpected error', async () => {
        mocks.usecases.startGameUC.execute.mockRejectedValue(
          new Error('Unexpected')
        );

        const res = await request(app).post(`${BASE_URL}/start`);

        expect(res.status).toBe(500);
        expect((res.body as ApiResponse).status).toBe('error');
      });
    });

    describe('POST `/game/:id/answer`', () => {
      it('responds with 200 without nouns', async () => {
        const gameId = 'g1';

        const payload = {
          nounId: 'noun-1',
          answer: 'feminine'
        };

        const mockResult = {
          correct: true,
          currentScore: 10,
          nouns: undefined
        };

        mocks.usecases.submitAnswerUC.execute.mockResolvedValue(mockResult);

        const res = await request(app)
          .post(`${BASE_URL}/${gameId}/answer`)
          .send(payload);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          status: 'success',
          data: mockResult
        });

        expect(mocks.methods.submitAnswerUC.execute)
          .toHaveBeenCalledWith({ gameId, ...payload });
      });

      it('responds with 200 with new nouns', async () => {
        const gameId = 'game-123';

        const payload = {
          nounId: 'noun-123',
          answer: 'masculine'
        };

        const nouns = [
          { id: 'noun-124', word: 'Tisch', meanings: ['table'] }
        ];

        mocks.usecases.submitAnswerUC.execute.mockResolvedValue({
          correct: true,
          currentScore: 12,
          nouns
        });

        const res = await request(app)
          .post(`${BASE_URL}/${gameId}/answer`)
          .send(payload);

        expect(res.status).toBe(200);

        const body = res.body as ApiResponse;

        if (body.status !== 'success') throw new Error('Expected success response');

        expect((body.data as SubmitAnswerDTO).nouns).toEqual(nouns);
      });

      it('responds with 404 if game not found', async () => {
        mocks.usecases.submitAnswerUC.execute.mockRejectedValue(
          new NotFoundError('Game not found')
        );

        const res = await request(app)
          .post(`${BASE_URL}/missing/answer`)
          .send({ nounId: 'n-123', answer: 'feminine' });

        expect(res.status).toBe(404);
        expect((res.body as ApiResponse).status).toBe('fail');
      });

      it('responds with 400 if noun not found', async () => {
        mocks.usecases.submitAnswerUC.execute.mockRejectedValue(
          new InvariantError('Noun not found')
        );

        const res = await request(app)
          .post(`${BASE_URL}/g1/answer`)
          .send({ nounId: 'missing', answer: 'feminine' });

        expect(res.status).toBe(400);
        expect((res.body as ApiResponse).status).toBe('fail');
      });

      it('responds with 400 for invalid payload', async () => {
        const res = await request(app)
          .post(`${BASE_URL}/game-123/answer`)
          .send({ nounId: 123 });

        expect(res.status).toBe(400);
        expect((res.body as ApiResponse).status).toBe('fail');
      });
    });

    describe('PATCH `/game/:id`', () => {
      it('responds with 200 on successful update', async () => {
        const gameId = 'g-123';
        const payload = { userId: 'u-123' } satisfies UpdateGamePayload;

        const updated: UpdateGameDTO = {
          id: gameId,
          nouns: [],
          userId: 'u-234',
          points: 20
        };

        mocks.usecases.updateGameUC.execute.mockResolvedValue(updated);

        const res = await request(app)
          .patch(`${BASE_URL}/${gameId}`)
          .send(payload);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          status: 'success',
          data: updated
        });

        expect(mocks.methods.updateGameUC.execute).toHaveBeenCalledWith({
          payload,
          id: gameId
        } satisfies UpdateGameCmd);
      });

      it('responds with 404 if game not found', async () => {
        mocks.usecases.updateGameUC.execute.mockRejectedValue(
          new NotFoundError('Game not found')
        );

        const res = await request(app)
          .patch(`${BASE_URL}/missing`)
          .send({ paused: true });

        expect(res.status).toBe(404);
        expect((res.body as ApiResponse).status).toBe('fail');
      });

      it('responds with 500 unexpected error', async () => {
        mocks.usecases.updateGameUC.execute.mockRejectedValue(
          new Error('Unexpected')
        );

        const res = await request(app)
          .patch(`${BASE_URL}/err`)
          .send({ paused: false });

        expect(res.status).toBe(500);
        expect((res.body as ApiResponse).status).toBe('error');
      });
    });
  });
}
