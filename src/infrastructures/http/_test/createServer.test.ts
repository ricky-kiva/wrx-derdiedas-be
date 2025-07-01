import 'reflect-metadata';

import request from 'supertest';
import { DependencyContainer, container } from 'tsyringe';
import { DITokens } from '../../../commons/DITokens';
import RootHandler from '../../../interfaces/http/api/root/handler';
import SearchNounHandler from '../../../interfaces/http/api/searchNoun/handler';
import SearchNounUseCase from '../../../applications/use_case/SearchNounUseCase';
import createServer from '../createServer';
import { ServiceInfoResponse } from '../../../interfaces/http/types/ServiceInfoResponse';
import SearchResultDTO from '../../../applications/dto/SearchResultDTO';
import { NounDTO } from '../../../applications/dto/NounDTO';
import ApiResponse from '../../../interfaces/http/types/ApiResponse';

describe('createServer', () => {
  let mockSearchNounUseCase: jest.Mocked<SearchNounUseCase>;
  let testContainer: DependencyContainer;
  let app: ReturnType<typeof createServer>;

  beforeEach(() => {
    testContainer = container.createChildContainer();
    
    testContainer.register(DITokens.RootHandler, { useClass: RootHandler });
    testContainer.register(DITokens.SearchNounHandler, { useClass: SearchNounHandler });

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

  it('responds to GET / with service info', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining<ServiceInfoResponse>({
        status: 'success',
        service: 'derdiedas_be',
        version: expect.stringMatching(/^\d+\.\d+\.\d+$/) as unknown as string,
        message: expect.any(String) as unknown as string 
      })
    );
  });
  
  it('responds to POST `/search` with search results', async () => {
    const mockResult: SearchResultDTO<NounDTO>[] = [
      {
        item: { id: 'noun-101', word: 'Katze', gender: 'feminine' } satisfies NounDTO,
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
    const res = await request(app)
      .post('/search')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({
      status: 'fail',
      message: expect.any(String) as unknown as string
    } satisfies ApiResponse);
  });

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

    testContainer.registerInstance(DITokens.SearchNounHandler, BadSearchNounHandler);

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
