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
  describe('Search Routes Integration', () => {
    let mockSearchNounUseCase: jest.Mocked<SearchNounUseCase>;

    beforeEach(() => {
      const testContainer = getTestContainer();

      const mockExecuteMethod = jest.fn();

      mockSearchNounUseCase = {
        execute: mockExecuteMethod
      } as unknown as jest.Mocked<SearchNounUseCase>;

      testContainer.registerInstance(DITokens.SearchNounUseCase, mockSearchNounUseCase);
    });

    it('responds to POST `/search` with search results', async () => {
      const app = getApp();

      const mockResult: SearchResultDTO<NounDTO>[] = [
        {
          item: { id: 'noun-101', word: 'Katze', gender: 'feminine', meanings: [] } satisfies NounDTO,
          score: 0.01
        } satisfies SearchResultDTO<NounDTO>
      ];

      mockSearchNounUseCase.execute.mockReturnValue(mockResult);

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
