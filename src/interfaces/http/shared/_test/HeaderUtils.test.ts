import 'reflect-metadata';
import HeaderUtils from '../HeaderUtils';
import { Request } from 'express';
import TokenManager from '../../../../applications/ports/security/TokenManager';
import { AuthenticationError } from '../../../../commons/exceptions';

describe('HeaderUtils', () => {
  let tokenManager: jest.Mocked<TokenManager>;
  let headerUtils: HeaderUtils;
  let mockTMDecodePayload: jest.Mock;

  beforeEach(() => {
    mockTMDecodePayload = jest.fn();

    tokenManager = {
      decodePayload: mockTMDecodePayload
    } as unknown as jest.Mocked<TokenManager>;

    headerUtils = new HeaderUtils(tokenManager);
  });

  it('returns userId when valid token is provided', () => {
    const userId = 'user-123';
    const mockToken = 'valid.token';

    tokenManager.decodePayload.mockReturnValue({ userId });

    const req = { headers: { authorization: `Bearer ${mockToken}` } } as Request;

    const result = headerUtils.extractUserId(req);

    expect(result).toBe(userId);
    expect(mockTMDecodePayload).toHaveBeenCalledWith(mockToken);
  });

  it('returns undefined when no Authorization header is present', () => {
    const req = { headers: {} } as Request;

    const result = headerUtils.extractUserId(req);

    expect(result).toBeUndefined();
  });

  it('returns undefined when Authorization header has no token', () => {
    const req = { headers: { authorization: 'Bearer' } } as Request;

    const result = headerUtils.extractUserId(req);

    expect(result).toBeUndefined();
  });

  it('throws AuthenticationError when token is invalid', () => {
    tokenManager.decodePayload.mockImplementation(() => {
      throw new Error('Invalid');
    });

    const req = { headers: { authorization: 'Bearer bad-token' } } as Request;

    expect(() => headerUtils.extractUserId(req)).toThrow(AuthenticationError);
  });
});
