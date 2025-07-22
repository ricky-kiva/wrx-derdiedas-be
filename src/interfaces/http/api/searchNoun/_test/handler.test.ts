import 'reflect-metadata';

import { Request, Response } from 'express';
import SearchNounUseCase from '../../../../../applications/use-case/SearchNounUseCase';
import SearchNounHandler from '../handler';
import SearchResultDTO from '../../../../../applications/dto/SearchResultDTO';
import { NounDTO } from '../../../../../applications/dto/NounDTO';
import { SearchNounPayload } from '../../../adapters/validation/searchNoun/types';
import ApiResponse from '../../../types/ApiResponse';

describe('SearchNounHandler', () => {
  let mockUseCase: jest.Mocked<SearchNounUseCase>;
  let handler: SearchNounHandler;
  let mockRequest: Request<unknown, unknown, SearchNounPayload>;
  let mockResponse: Response;
  let payload: SearchNounPayload;

  const createMockRequest = (body: unknown): Request<unknown, unknown, SearchNounPayload> => {
    return { body } as Request<unknown, unknown, SearchNounPayload>;
  };

  const createMockResponse = (): Response => {
    return {
      json: jest.fn()
    } as unknown as Response;
  };

  const mockExecuteMethod = jest.fn();

  beforeEach(() => {
    mockUseCase = {
      execute: mockExecuteMethod
    } as unknown as jest.Mocked<SearchNounUseCase>;

    handler = new SearchNounHandler(mockUseCase);

    payload = { word: 'katze' };

    mockRequest = createMockRequest(payload);
    mockResponse = createMockResponse();
  });

  it('responds with results & calls use case', () => {
    const mockResults: SearchResultDTO<NounDTO>[] = [
      {
        item: { id: 'noun-101', word: 'Katze', gender: 'feminine', meanings: [] },
        score: 0.01
      }
    ];

    mockUseCase.execute.mockReturnValue(mockResults);

    handler.searchNoun(mockRequest, mockResponse);

    expect(mockExecuteMethod).toHaveBeenCalledWith(payload.word);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'success',
      data: mockResults
    } satisfies ApiResponse);
  });
});
