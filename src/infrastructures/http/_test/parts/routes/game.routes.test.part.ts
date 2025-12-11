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
import { GetGameByIdDTO } from '../../../../../applications/use-cases/game/get/dto/GetGameByIdDTO';
import { StartGameDTO } from '../../../../../applications/use-cases/game/start/dto/StartGameDTO';
import { SubmitAnswerCmd } from '../../../../../applications/use-cases/game/submit-answer/command/SubmitAnswerCmd';
import { Gender } from '../../../../../domains/noun/entities/Noun';
import { EndGameCmd } from '../../../../../applications/use-cases/game/end/commands/EndGameCmd';

export default function testGameRoutes(
  getApp: () => Application,
  getMocks: () => TestPartMocks
) {
  const BASE_URL = '/game';
  const mockGameId = '6c9f8c77-40b4-4c6b-a2a4-9ddf43e19c32';
  const mockUserId = '507f1f77bcf86cd799439012';
  const mockNounId = '507f1f88bcf86cd799439011';
  const mockGameToken = 'mock.game.token';

  describe('Game Routes Integration', () => {
    let app: Application;
    let mocks: TestPartMocks;

    beforeEach(() => {
      app = getApp();
      mocks = getMocks();

      jest
        .spyOn(HeaderUtils.prototype, 'extractUserId')
        .mockImplementation(() => undefined);
      jest
        .spyOn(HeaderUtils.prototype, 'getGameToken')
        .mockReturnValue(mockGameToken);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe('DELETE `/game/:id`', () => {
      beforeEach(() => {
        (HeaderUtils.prototype.getGameToken as jest.Mock).mockReturnValue(mockGameToken);
      });

      it('responds with 204 on successful delete', async () => {
        mocks.usecases.deleteGameUC.execute.mockResolvedValue(undefined);

        const res = await request(app).delete(`${BASE_URL}/${mockGameId}`);

        expect(res.status).toBe(204);
        expect(res.body).toEqual({});

        expect(mocks.methods.deleteGameUC.execute)
          .toHaveBeenCalledWith(mockGameToken, mockGameId);
      });

      it('responds with 404 if game not found', async () => {
        mocks.usecases.deleteGameUC.execute.mockRejectedValue(
          new NotFoundError('Game not found')
        );

        const res = await request(app).delete(`${BASE_URL}/${mockGameId}`);

        expect(res.status).toBe(404);
        expect((res.body as ApiResponse).status).toBe('fail');
      });

      it('responds with 500 for unexpected error', async () => {
        mocks.usecases.deleteGameUC.execute.mockRejectedValue(
          new Error('Unexpected')
        );

        const res = await request(app).delete(`${BASE_URL}/${mockGameId}`);

        expect(res.status).toBe(500);
        expect((res.body as ApiResponse).status).toBe('error');
      });
    });

    describe('POST `/game/:id/end`', () => {
      beforeEach(() => {
        (HeaderUtils.prototype.getGameToken as jest.Mock).mockReturnValue(mockGameToken);
      });

      it('responds with 200 when logged-in user ends game', async () => {
        (HeaderUtils.prototype.extractUserId as jest.Mock).mockReturnValue(mockUserId);

        mocks.usecases.endGameUC.execute.mockResolvedValue(mockUserId);

        const res = await request(app)
          .post(`${BASE_URL}/${mockGameId}/end`)
          .send({ name: undefined });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          status: 'success',
          data: { userId: mockUserId }
        });

        expect(mocks.methods.endGameUC.execute).toHaveBeenCalledWith({
          gameId: mockGameId,
          gameToken: mockGameToken,
          name: undefined
        } satisfies EndGameCmd);
      });

      it('responds with 200 when anonymous user ends game with name', async () => {
        const name = 'Rickyslash';

        mocks.usecases.endGameUC.execute.mockResolvedValue(mockUserId);

        const res = await request(app)
          .post(`${BASE_URL}/${mockGameId}/end`)
          .send({ name });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          status: 'success',
          data: { userId: mockUserId }
        });

        expect(mocks.methods.endGameUC.execute).toHaveBeenCalledWith({ 
          gameId: mockGameId, 
          gameToken: mockGameToken, 
          name 
        } satisfies EndGameCmd);
      });

      it('responds with 404 if game not found', async () => {
        mocks.usecases.endGameUC.execute.mockRejectedValue(
          new NotFoundError('Game not found')
        );

        const res = await request(app)
          .post(`${BASE_URL}/${mockGameId}/end`)
          .send({ name: 'A' });

        expect(res.status).toBe(404);
        expect((res.body as ApiResponse).status).toBe('fail');
      });

      it('responds with 400 if anonymous user does not provide name', async () => {
        mocks.usecases.endGameUC.execute.mockRejectedValue(
          new InvariantError('Name is required')
        );

        const res = await request(app)
          .post(`${BASE_URL}/${mockGameId}/end`)
          .send({});

        expect(res.status).toBe(400);
        expect((res.body as ApiResponse).status).toBe('fail');
      });

      it('responds with 500 for unexpected error', async () => {
        mocks.usecases.endGameUC.execute.mockRejectedValue(
          new Error('Unexpected')
        );

        const res = await request(app)
          .post(`${BASE_URL}/${mockGameId}/end`)
          .send({ name: 'Rickyslash' });

        expect(res.status).toBe(500);
        expect((res.body as ApiResponse).status).toBe('error');
      });
    });

    describe('GET `/game/:id`', () => {
      it('responds with 200 and game data', async () => {
        const mockGame: GetGameByIdDTO = {
          id: mockGameId,
          userId: 'user-123',
          points: 10,
          nouns: [{ id: 'noun-123', word: 'Hund', meanings: ['dog'] }]
        };

        mocks.usecases.getGameByIdUC.execute.mockResolvedValue(mockGame);

        const res = await request(app).get(`${BASE_URL}/${mockGameId}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          status: 'success',
          data: mockGame
        });

        expect(mocks.methods.getGameByIdUC.execute).toHaveBeenCalledWith(mockGameId);
      });

      it('responds with 404 if game not found', async () => {
        mocks.usecases.getGameByIdUC.execute.mockRejectedValue(
          new NotFoundError('Game not found')
        );

        const res = await request(app).get(`${BASE_URL}/${mockGameId}`);

        expect(res.status).toBe(404);
        expect((res.body as ApiResponse).status).toBe('fail');
      });

      it('responds with 500 on unexpected error', async () => {
        mocks.usecases.getGameByIdUC.execute.mockRejectedValue(
          new Error('Unexpected')
        );

        const res = await request(app).get(`${BASE_URL}/${mockGameId}`);

        expect(res.status).toBe(500);
        expect((res.body as ApiResponse).status).toBe('error');
      });
    });

    describe('POST `/game/start`', () => {
      beforeEach(() => {
        (HeaderUtils.prototype.getGameToken as jest.Mock).mockReturnValue(mockGameToken);
      });

      it('responds with 200 for anonymous user', async () => {
        const mockGame: StartGameDTO = { id: mockGameId, nouns: [] };

        mocks.usecases.startGameUC.execute.mockResolvedValue(mockGame);

        const res = await request(app).post(`${BASE_URL}/start`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          status: 'success',
          data: mockGame
        });

        expect(mocks.methods.startGameUC.execute).toHaveBeenCalledWith(mockGameToken, undefined);
      });

      it('responds with 200 for logged-in user', async () => {
        (HeaderUtils.prototype.extractUserId as jest.Mock).mockReturnValue(mockUserId);

        const game: StartGameDTO = { id: mockGameId, nouns: [] };

        mocks.usecases.startGameUC.execute.mockResolvedValue(game);

        const res = await request(app)
          .post(`${BASE_URL}/start`)
          .set('Authorization', 'Bearer x');

        expect(res.status).toBe(200);

        const body = res.body as ApiResponse;
        
        if (body.status !== 'success') throw new Error('Expected success response');

        expect(body.data).toEqual(game);

        expect(mocks.methods.startGameUC.execute).toHaveBeenCalledWith(mockGameToken, mockUserId);
      });

      it('responds with 500 on unexpected error', async () => {
        mocks.usecases.startGameUC.execute.mockRejectedValue(new Error('Unexpected'));

        const res = await request(app).post(`${BASE_URL}/start`);

        expect(res.status).toBe(500);
        expect((res.body as ApiResponse).status).toBe('error');
      });
    });


    describe('POST `/game/:id/answer`', () => {
      beforeEach(() => {
        (HeaderUtils.prototype.getGameToken as jest.Mock).mockReturnValue(mockGameToken);
      });

      it('responds with 200 without nouns', async () => {
        const payload = {
          nounId: mockNounId,
          answer: 'feminine' as Gender
        };

        const mockResult = {
          correct: true,
          currentScore: 10,
          nouns: undefined
        };

        mocks.usecases.submitAnswerUC.execute.mockResolvedValue(mockResult);

        const res = await request(app)
          .post(`${BASE_URL}/${mockGameId}/answer`)
          .send(payload);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          status: 'success',
          data: mockResult
        });

        expect(mocks.methods.submitAnswerUC.execute)
          .toHaveBeenCalledWith({ gameId: mockGameId, gameToken: mockGameToken, ...payload } satisfies SubmitAnswerCmd);
      });

      it('responds with 200 with new nouns', async () => {
        const payload = {
          nounId: mockNounId,
          answer: 'masculine'
        };

        const nouns = [
          { id: (mockNounId.slice(0, -1) + '2'), word: 'Tisch', meanings: ['table'] }
        ];

        mocks.usecases.submitAnswerUC.execute.mockResolvedValue({
          correct: true,
          currentScore: 12,
          nouns
        });

        const res = await request(app)
          .post(`${BASE_URL}/${mockGameId}/answer`)
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
          .post(`${BASE_URL}/${mockGameId}/answer`)
          .send({ nounId: mockNounId, answer: 'feminine' });

        expect(res.status).toBe(404);
        expect((res.body as ApiResponse).status).toBe('fail');
      });

      it('responds with 400 if noun not found', async () => {
        mocks.usecases.submitAnswerUC.execute.mockRejectedValue(
          new InvariantError('Noun not found')
        );

        const res = await request(app)
          .post(`${BASE_URL}/${mockGameId}/answer`)
          .send({ nounId: 'missing', answer: 'feminine' });

        expect(res.status).toBe(400);
        expect((res.body as ApiResponse).status).toBe('fail');
      });

      it('responds with 400 for invalid payload', async () => {
        const res = await request(app)
          .post(`${BASE_URL}/${mockGameId}/answer`)
          .send({ nounId: mockNounId });

        expect(res.status).toBe(400);
        expect((res.body as ApiResponse).status).toBe('fail');
      });
    });

    describe('PATCH `/game/:id`', () => {
      beforeEach(() => {
        (HeaderUtils.prototype.getGameToken as jest.Mock).mockReturnValue(mockGameToken);
      });
      
      it('responds with 200 on successful update', async () => {
        const payload = { userId: mockUserId } satisfies UpdateGamePayload;

        const updated: UpdateGameDTO = {
          id: mockGameId,
          nouns: [],
          userId: mockUserId,
          points: 20
        };

        mocks.usecases.updateGameUC.execute.mockResolvedValue(updated);

        const res = await request(app)
          .patch(`${BASE_URL}/${mockGameId}`)
          .send(payload);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          status: 'success',
          data: updated
        });

        expect(mocks.methods.updateGameUC.execute).toHaveBeenCalledWith({
          payload,
          id: mockGameId,
          gameToken: mockGameToken
        } satisfies UpdateGameCmd);
      });

      it('responds with 404 if game not found', async () => {
        mocks.usecases.updateGameUC.execute.mockRejectedValue(
          new NotFoundError('Game not found')
        );

        const res = await request(app)
          .patch(`${BASE_URL}/${mockGameId}`)
          .send({ paused: true });

        expect(res.status).toBe(404);
        expect((res.body as ApiResponse).status).toBe('fail');
      });

      it('responds with 500 unexpected error', async () => {
        mocks.methods.updateGameUC.execute.mockRejectedValue(
          new Error('Unexpected')
        );

        const res = await request(app)
          .patch(`${BASE_URL}/${mockGameId}`)
          .send({ userId: mockUserId });

        expect(res.status).toBe(500);
        expect((res.body as ApiResponse).status).toBe('error');
      });
    });

    describe('GET `/game/token`', () => {
      it('responds with 200 and returns token', async () => {
        const mockToken = 'game-token-123';
        mocks.usecases.issueGameTokenUC.execute.mockReturnValue(mockToken);

        const res = await request(app).get('/game/token');

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          status: 'success',
          data: { token: mockToken }
        });
        expect(mocks.methods.issueGameTokenUC.execute).toHaveBeenCalled();
      });

      it('responds with 500 on unexpected error', async () => {
        mocks.usecases.issueGameTokenUC.execute.mockImplementation(() => {
          throw new Error('Unexpected');
        });

        const res = await request(app).get('/game/token');

        expect(res.status).toBe(500);
        expect((res.body as ApiResponse).status).toBe('error');
      });
    });
  });
}
