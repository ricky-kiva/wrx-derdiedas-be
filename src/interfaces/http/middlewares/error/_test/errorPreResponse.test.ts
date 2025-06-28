import { Request, Response } from 'express';
import { NotFoundError, ServiceUnavailableError } from '../../../../../commons/exceptions';
import errorPreResponse from '../errorPreReponse';

describe('errorPreResponse Middleware', () => {
  let mockReq: Request;
  let mockRes: Response;
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

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse() as Response;
  });

  it('responds with 4XX and status "fail" for ClientError', () => {
    const errorMessage = 'not found';
    const error = new NotFoundError(errorMessage);

    errorPreResponse(error, mockReq, mockRes);

    expect(mockResponseStatusValue).toHaveBeenCalledWith(error.statusCode);
    expect(mockResponseJsonValue).toHaveBeenCalledWith({
      status: 'fail',
      message: errorMessage
    });
  });

  it('responds with 5XX and status "error" for ServerError', () => {
    const errorMessage = 'service not available yet';
    const error = new ServiceUnavailableError(errorMessage);

    errorPreResponse(error, mockReq, mockRes);

    expect(mockResponseStatusValue).toHaveBeenCalledWith(error.statusCode);
    expect(mockResponseJsonValue).toHaveBeenCalledWith({
      status: 'error',
      message: errorMessage
    });
  });

  it('responds with 500 and generic error message for unknown error', () => {
    const errorMessage = 'unknwon error';
    const error = new Error(errorMessage);

    errorPreResponse(error, mockReq, mockRes);

    expect(mockResponseStatusValue).toHaveBeenCalledWith(500);
    expect(mockResponseJsonValue).toHaveBeenCalledWith({
      status: 'error',
      message: 'internal server error',
    });
  });
});
