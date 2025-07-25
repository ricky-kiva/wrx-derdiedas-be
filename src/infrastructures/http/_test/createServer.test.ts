import 'reflect-metadata';

import request from 'supertest';
import { DependencyContainer, container } from 'tsyringe';
import { DITokens } from '../../../commons/DITokens';
import RootHandler from '../../../interfaces/http/api/root/handler';
import SearchNounHandler from '../../../interfaces/http/api/search/handler';
import SearchNounUseCase from '../../../applications/use-cases/noun/search/SearchNounUseCase';
import createServer from '../createServer';
import ApiResponse from '../../../interfaces/http/types/ApiResponse';
import LogMW from '../../../interfaces/http/middlewares/log/LogMW';
import WinstonLoggerService from '../../adapters/logger/WinstonLoggerService';
import SearchHandler from '../../../interfaces/http/api/search/handler';
import testRootRoutes from './parts/root.routes.test.part';
import testSearchRoutes from './parts/search.routes.test.part';

describe('createServer', () => {
  let mockSearchNounUseCase: jest.Mocked<SearchNounUseCase>;
  let testContainer: DependencyContainer;
  let app: ReturnType<typeof createServer>;

  beforeEach(() => {
    testContainer = container.createChildContainer();
    
    testContainer.register(DITokens.RootHandler, { useClass: RootHandler });
    testContainer.register(DITokens.SearchHandler, { useClass: SearchHandler });
    testContainer.register(DITokens.LoggerService, { useClass: WinstonLoggerService });
    testContainer.register(DITokens.LogMW, { useClass: LogMW });

    const mockExecuteMethod = jest.fn();

    mockSearchNounUseCase = {
      execute: mockExecuteMethod
    } as unknown as jest.Mocked<SearchNounUseCase>;

    testContainer.registerInstance(DITokens.SearchNounUseCase, mockSearchNounUseCase);

    app = createServer(testContainer);
  });

  afterEach(() => {
    testContainer.clearInstances();
  });

  testRootRoutes(() => app);
  testSearchRoutes(() => app, () => testContainer);

  it('responds with 404 for unregistered routes', async () => {
    const res = await request(app).get('/nonexsistent/route');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      status: 'fail',
      message: 'route not found'
    } satisfies ApiResponse);
  });

  it('responds with 500 when unhandled error is thrown by handler', async () => {
    const BadSearchNounHandler: Pick<SearchNounHandler, 'searchNoun'> = {
      searchNoun: (_req: Request, _res: Response) => {
        throw new Error('Unexpected failure');
      }
    } as unknown as SearchNounHandler;

    testContainer.registerInstance(DITokens.SearchHandler, BadSearchNounHandler);

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
