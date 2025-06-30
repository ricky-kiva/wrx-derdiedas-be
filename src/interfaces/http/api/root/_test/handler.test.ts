import 'reflect-metadata';

import { Request, Response } from 'express';
import RootHandler from '../handler';
import { ServiceInfoResponse } from '../../../types/ServiceInfoResponse';

describe('RootHandler', () => {
  let handler: RootHandler;
  let mockRequest: Request;
  let mockResponse: Response;

  const createMockRequest = (): Request => {
    return {} as Request;
  };

  const createMockResponse = (): Response => {
    return {
      json: jest.fn()
    } as unknown as Response;
  };

  beforeEach(() => {
    handler = new RootHandler();
    mockRequest = createMockRequest();
    mockResponse = createMockResponse();
  });

  it('responds with service info', () => {
    handler.getServiceInfo(mockRequest, mockResponse);

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
      status: 'success',
      service: 'derdiedas_be',
      version: expect.stringMatching(/^\d+\.\d+\.\d+$/) as unknown as string,
      message: expect.any(String) as unknown as string
    } satisfies ServiceInfoResponse)
    );
  });
});
