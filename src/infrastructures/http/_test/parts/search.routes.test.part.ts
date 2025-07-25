import { Application } from 'express';
import request from 'supertest';
import { DependencyContainer } from 'tsyringe';
import SearchResultDTO from '../../../../applications/use-cases/noun/search/dto/SearchResultDTO';
import { NounDTO } from '../../../../applications/use-cases/noun/search/dto/NounDTO';
import ApiResponse from '../../../../interfaces/http/types/ApiResponse';
import SearchNounUseCase from '../../../../applications/use-cases/noun/search/SearchNounUseCase';
import { DITokens } from '../../../../commons/DITokens';

export default function testSearchRoutes(
  getApp: () => Application, 
  getTestContainer: () => DependencyContainer
) {
  describe('Search Routes', () => {
    it('responds to POST `/search` with search results', async () => {
      const app = getApp();
      const testContainer = getTestContainer();

      const mockResult: SearchResultDTO<NounDTO>[] = [
        {
          item: { id: 'noun-101', word: 'Katze', gender: 'feminine', meanings: [] } satisfies NounDTO,
          score: 0.01
        } satisfies SearchResultDTO<NounDTO>
      ];

      const searchNounUseCase: jest.Mocked<SearchNounUseCase> =  testContainer
        .resolve(DITokens.SearchNounUseCase);

      searchNounUseCase.execute.mockReturnValue(mockResult);

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
      const app = getApp();

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
