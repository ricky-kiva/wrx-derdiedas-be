import { Request, Response } from 'express';
import notFound from '../notFound';
import ApiResponse from '../../../types/ApiResponse';

describe('notFound Middleware', () => {
  let mockReq: Request;
  let mockRes: Response;
  let mockResStatusValue: jest.Mock;
  let mockResJsonValue: jest.Mock;

  const mockResStatusMethod = (res: Partial<Response>) => jest.fn().mockReturnValue(res);
  const mockResJsonStatusMethod = (res: Partial<Response>) => jest.fn().mockReturnValue(res);

  const createMockRequest = (body: unknown={}): Request => {
    return { body } as Request;
  };

  const createMockResponse = (res: Partial<Response>={}): Partial<Response> => {
    mockResStatusValue = mockResStatusMethod(res);
    mockResJsonValue = mockResJsonStatusMethod(res);
    
    res.status = mockResStatusValue;
    res.json = mockResJsonValue;

    return res;
  };

  beforeEach(() => {
    mockReq = createMockRequest();
    mockRes = createMockResponse() as Response;
  });

  it('responds with 404 & proper JSON message', () => {
    notFound(mockReq, mockRes);

    expect(mockResStatusValue).toHaveBeenCalledWith(404);
    expect(mockResJsonValue).toHaveBeenCalledWith({
      status: 'fail',
      message: 'route not found'
    } satisfies ApiResponse);
  });
});
