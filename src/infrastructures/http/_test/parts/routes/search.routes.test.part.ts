import { Application } from 'express';
import request from 'supertest';
import SearchResultDTO from '../../../../../applications/use-cases/noun/search/dto/SearchResultDTO';
import { NounDTO } from '../../../../../applications/use-cases/noun/search/dto/NounDTO';
import ApiResponse from '../../../../../interfaces/http/types/ApiResponse';
import { TestPartMocks } from '../mocks/useCases.mock.test.part';

export default function testSearchRoutes(
  getApp: () => Application,
  getMocks: () => TestPartMocks
) {
  describe('Search Routes Integration', () => {
    let app: Application;
    let mocks: TestPartMocks;

    beforeEach(() => {
      app = getApp();
      mocks = getMocks();
    });

    it('responds to POST `/search` with search results', async () => {
      const mockResult: SearchResultDTO<NounDTO>[] = [
        {
          item: { id: 'noun-101', word: 'Katze', gender: 'feminine', meanings: [] } satisfies NounDTO,
          score: 0.01
        } satisfies SearchResultDTO<NounDTO>
      ];

      mocks.usecases.seachNounUC.execute.mockReturnValue(mockResult);

      const res = await request(app)
        .post('/search')
        .send({ word: 'katze' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: 'success',
        data: mockResult
      } satisfies ApiResponse);
    });

    it('responds with 400 for invalid search payload', async () => {
      const res = await request(app)
        .post('/search')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        status: 'fail',
        message: expect.any(String) as unknown as string
      } satisfies ApiResponse);
    });
  });
}
