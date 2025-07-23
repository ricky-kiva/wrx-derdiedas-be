import JwtPayloadDTO from '../../../../../ports/security/dto/JwtPayloadDTO';
import JwtTokenDTO from '../../../../../ports/security/dto/JwtTokenDTO';
import TokenManager from '../../../../../ports/security/TokenManager';
import TokenStore from '../../../../../ports/security/TokenStore';
import RefreshTokenUseCase from '../RefreshTokenUseCase';

describe('RefreshTokenUseCase', () => {
  it('should refresh Access & Refresh Tokens correctly', async () => {
    const mockRefreshToken = 'refresh.token';
    const mockNewAccessToken = 'new.access.token';
    const mockNewRefreshToken = 'new.refresh.token';
    const payload: JwtPayloadDTO = { userId: 'user-123' };

    const mockGAccessTokenMethod = jest.fn().mockReturnValue(mockNewAccessToken);
    const mockGRefreshTokenMethod = jest.fn().mockReturnValue(mockNewRefreshToken);
    const mockVRefreshTokenMethod = jest.fn();
    const mockDPayloadMethod = jest.fn().mockReturnValue(payload);

    const mockTokenManager: TokenManager = {
      generateAccessToken: mockGAccessTokenMethod,
      generateRefreshToken: mockGRefreshTokenMethod,
      verifyRefreshToken: mockVRefreshTokenMethod,
      decodePayload: mockDPayloadMethod
    } as Partial<jest.Mocked<TokenManager>> as TokenManager;

    const mockVSRefreshTokenMethod = jest.fn().mockResolvedValue(undefined);
    const mockSRefreshTokenMethod = jest.fn().mockResolvedValue(undefined);

    const mockTokenStore: TokenStore = {
      verifyStoredRefreshToken: mockVSRefreshTokenMethod,
      storeRefreshToken: mockSRefreshTokenMethod
    } as Partial<jest.Mocked<TokenStore>> as TokenStore;

    const refreshTokenUseCase = new RefreshTokenUseCase(mockTokenManager, mockTokenStore);

    const result = await refreshTokenUseCase.execute(mockRefreshToken);

    expect(mockVRefreshTokenMethod).toHaveBeenCalledWith(mockRefreshToken);
    expect(mockDPayloadMethod).toHaveBeenCalledWith(mockRefreshToken);
    expect(mockVSRefreshTokenMethod).toHaveBeenCalledWith(payload.userId, mockRefreshToken);
    expect(mockGAccessTokenMethod).toHaveBeenCalledWith(payload);
    expect(mockGRefreshTokenMethod).toHaveBeenCalledWith(payload);
    expect(mockSRefreshTokenMethod).toHaveBeenCalledWith(payload.userId, mockNewRefreshToken);
    
    expect(result).toEqual({ 
      accessToken: mockNewAccessToken, 
      refreshToken: mockNewRefreshToken 
    } satisfies JwtTokenDTO);
  });
});
