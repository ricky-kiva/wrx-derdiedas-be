import os from 'os';
import { NextFunction, Request, Response } from 'express';
import LoggerService from '../../../../../applications/ports/logger/LoggerService';
import LogMW from '../LogMW';
import { ServiceUnavailableError } from '../../../../../commons/exceptions';

describe('LogMW', () => {
  let middleware: LogMW;
  let mockReq: Request;
  let mockRes: Response;
  let mockNext: NextFunction;

  const mockRequestMeta = {
    ip: '127.0.0.1',
    method: 'GET',
    path: '/api/test'
  };

  const mockInfoMethod = jest.fn();
  const mockWarnMethod = jest.fn();
  const mockErrorMethod = jest.fn();

  const mockLoggerService: LoggerService = {
    info: mockInfoMethod,
    warn: mockWarnMethod,
    error: mockErrorMethod
  };

  const createMockReq = (body: unknown={}): Request => {
      return { ...mockRequestMeta, body } as Request;
    };

  const createMockRes = (res: Partial<Response>={}): Response => {
    return res as Response;
  };

  const createMockNext = (): NextFunction => jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    middleware = new LogMW(mockLoggerService);
    mockReq = createMockReq();
    mockRes = createMockRes();
    mockNext = createMockNext();
  });

  describe('logRequest', () => {
    it('should call `logger.info` with req. metadata & call `next`', () => {
      middleware.logRequest(mockReq, mockRes, mockNext);

      expect(mockInfoMethod).toHaveBeenCalledWith('Incoming request', { ...mockRequestMeta, host: os.hostname() });
      expect(mockNext).toHaveBeenCalled();
    });

    describe('error', () => {
      
    });
  });

  describe('logError', () => {
    it('should call `logger.error` with error and request metadata & call `next(err)`', () => {
      const errorMessage = 'service currently unavailable';

      const error = new ServiceUnavailableError(errorMessage);

      middleware.logError(error, mockReq, mockRes, mockNext);

      expect(mockErrorMethod).toHaveBeenCalledWith(error.message, error);
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
