import request from 'supertest';
import ApiResponse from '../../../../../interfaces/http/types/ApiResponse';
import { DITokens } from '../../../../../commons/DITokens';
import SearchHandler from '../../../../../interfaces/http/api/search/handler';
import { DependencyContainer } from 'tsyringe';
import { Application } from 'express';
import createServer from '../../../createServer';

export default function testErrorPreResponseMW(getTestContainer: () => DependencyContainer) {
  describe('Error Pre-Response Middleware Integration', () => {
    let app: Application;
    let testContainer: DependencyContainer;
    
    beforeEach(() => {
      testContainer = getTestContainer();
    });

    it('responds with 500 when unhandled error is thrown by handler', async () => {
      const badSearchNounHandler: Pick<SearchHandler, 'searchNoun'> = {
        searchNoun: (_req: Request, _res: Response) => {
          throw new Error('Unexpected failure');
        }
      } as unknown as SearchHandler;

      testContainer.registerInstance(DITokens.SearchHandler, badSearchNounHandler);

      app = createServer(testContainer);

      const res = await request(app)
        .post('/search')
        .send({ word: 'katze' });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({
        status: 'error',
        message: 'internal server error'
      } satisfies ApiResponse);
    });
  });
}
