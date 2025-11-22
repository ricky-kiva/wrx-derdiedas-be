import JwtPayloadDTO from '../../../../../ports/security/dto/JwtPayloadDTO';
import JwtTokenDTO from '../../../../../ports/security/dto/JwtTokenDTO';
import TokenManager from '../../../../../ports/security/TokenManager';
import TokenStore from '../../../../../ports/security/TokenStore';
import RefreshTokenUseCase from '../RefreshTokenUseCase';

describe('RefreshTokenUseCase', () => {
  const mockRefreshToken = 'refresh.token';
  const payload: JwtPayloadDTO = { userId: 'user-123' };
  const mockNewAccessToken = 'new.access.token';
  const mockNewRefreshToken = 'new.refresh.token';

  let mockTokenManager: TokenManager;
  let mockTokenStore: TokenStore;
  let refreshTokenUseCase: RefreshTokenUseCase;

  let mockGAccessTokenMethod: jest.Mock;
  let mockGRefreshTokenMethod: jest.Mock;
  let mockVRefreshTokenMethod: jest.Mock;
  let mockDPayloadMethod: jest.Mock;
  let mockVSRefreshTokenMethod: jest.Mock;
  let mockSRefreshTokenMethod: jest.Mock;

  beforeEach(() => {
    mockGAccessTokenMethod = jest.fn().mockReturnValue(mockNewAccessToken);
    mockGRefreshTokenMethod = jest.fn().mockReturnValue(mockNewRefreshToken);
    mockVRefreshTokenMethod = jest.fn();
    mockDPayloadMethod = jest.fn().mockReturnValue(payload);

    mockTokenManager = {
      generateAccessToken: mockGAccessTokenMethod,
      generateRefreshToken: mockGRefreshTokenMethod,
      verifyRefreshToken: mockVRefreshTokenMethod,
      decodePayload: mockDPayloadMethod
    } as Partial<jest.Mocked<TokenManager>> as TokenManager;

    mockVSRefreshTokenMethod = jest.fn();
    mockSRefreshTokenMethod = jest.fn().mockResolvedValue(undefined);

    mockTokenStore = {
      verifyStoredRefreshToken: mockVSRefreshTokenMethod,
      storeRefreshToken: mockSRefreshTokenMethod
    } as Partial<jest.Mocked<TokenStore>> as TokenStore;

    refreshTokenUseCase = new RefreshTokenUseCase(mockTokenManager, mockTokenStore);
  });

  it('should refresh Access & Refresh Tokens correctly', async () => {
    (mockTokenStore.verifyStoredRefreshToken as jest.Mock).mockResolvedValue(true);

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

  it('should return null if stored refresh token is invalid', async () => {
    (mockTokenStore.verifyStoredRefreshToken as jest.Mock).mockResolvedValue(false);

    const result = await refreshTokenUseCase.execute(mockRefreshToken);

    expect(mockVRefreshTokenMethod).toHaveBeenCalledWith(mockRefreshToken);
    expect(mockDPayloadMethod).toHaveBeenCalledWith(mockRefreshToken);
    expect(mockVSRefreshTokenMethod).toHaveBeenCalledWith(payload.userId, mockRefreshToken);

    expect(result).toBeNull();
  });
});
