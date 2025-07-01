import { NextFunction, Request, Response } from 'express';
import { NotFoundError, ServiceUnavailableError } from '../../../../../commons/exceptions';
import errorPreResponse from '../errorPreResponse';

describe('errorPreResponse Middleware', () => {
  let mockReq: Request;
  let mockRes: Response;
  let mockNext: NextFunction;
  let mockResponseStatusValue: jest.Mock;
  let mockResponseJsonValue: jest.Mock;

  const createMockRequest = (body: unknown={}): Request => {
    return { body } as Request;
  };

  const mockResponseStatusMethod = (res: Partial<Response>) => jest.fn().mockReturnValue(res);
  const mockResponseJsonStatusMethod = (res: Partial<Response>) => jest.fn().mockReturnValue(res);

  const createMockResponse = (res: Partial<Response>={}): Partial<Response> => {
    mockResponseStatusValue = mockResponseStatusMethod(res);
    mockResponseJsonValue = mockResponseJsonStatusMethod(res);
    
    res.status = mockResponseStatusValue;
    res.json = mockResponseJsonValue;

    return res;
  };

  const createMockNext = (): jest.MockedFunction<NextFunction> => {
    return jest.fn();
  };

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse() as Response;
    mockNext = createMockNext();
  });

  it('responds with 4XX and status "fail" for ClientError', async () => {
    const errorMessage = 'not found';
    const error = new NotFoundError(errorMessage);

    await errorPreResponse(error, mockReq, mockRes, mockNext);

    expect(mockResponseStatusValue).toHaveBeenCalledWith(error.statusCode);
    expect(mockResponseJsonValue).toHaveBeenCalledWith({
      status: 'fail',
      message: errorMessage
    });
  });

  it('responds with 5XX and status "error" for ServerError', async () => {
    const errorMessage = 'service not available yet';
    const error = new ServiceUnavailableError(errorMessage);

    await errorPreResponse(error, mockReq, mockRes, mockNext);

    expect(mockResponseStatusValue).toHaveBeenCalledWith(error.statusCode);
    expect(mockResponseJsonValue).toHaveBeenCalledWith({
      status: 'error',
      message: errorMessage
    });
  });

  it('responds with 500 and generic error message for unknown error', async () => {
    const errorMessage = 'unknwon error';
    const error = new Error(errorMessage);

    await errorPreResponse(error, mockReq, mockRes, mockNext);

    expect(mockResponseStatusValue).toHaveBeenCalledWith(500);
    expect(mockResponseJsonValue).toHaveBeenCalledWith({
      status: 'error',
      message: 'internal server error',
    });
  });
});
