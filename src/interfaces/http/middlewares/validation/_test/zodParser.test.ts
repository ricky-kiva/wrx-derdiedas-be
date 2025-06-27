import { NextFunction, Request, Response } from 'express';
import { SearchNounPayloadSchema } from '../../../adapters/validation/searchNoun/schemas';
import zodParser from '../zodParser';

describe('zodParser', () => {
  const middleware = zodParser(SearchNounPayloadSchema);

  const mockRequest = (body: unknown): Request => {
    return { body } as Request;
  };

  const mockResponse = (): Response => {
    return {} as Response;
  };

  const mockNext = (): jest.MockedFunction<NextFunction> => {
    return jest.fn();
  };

  it('should call next() on valid input', () => {
    const req = mockRequest({ word: 'Hund' });
    const res = mockResponse();
    const next = mockNext();

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should call next(err) on invalid input', () => {
    const req = mockRequest({ word: '' });
    const res = mockResponse();
    const next = mockNext();

    middleware(req, res, next);

    expect(next.mock.calls[0][0]).toBeInstanceOf(Error);
  });
});
