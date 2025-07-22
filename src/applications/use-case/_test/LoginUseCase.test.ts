import JwtPayloadDTO from '../../ports/security/dto/JwtPayloadDTO';
import JwtTokenDTO from '../../ports/security/dto/JwtTokenDTO';
import TokenManager from '../../ports/security/TokenManager';
import TokenStore from '../../ports/security/TokenStore';
import LoginUseCase from '../LoginUseCase';

describe('LoginUseCase', () => {
  it('should generate tokens & store refresh token', async () => {
    const fakePayload: JwtPayloadDTO = { userId: 'user-123', name: 'Rickyslash' };
    const mockAccessToken = 'access.token';
    const mockRefreshToken = 'refresh.token';

    const mockGAccessTokenMethod = jest.fn().mockReturnValue(mockAccessToken);
    const mockGRefreshTokenMethod = jest.fn().mockReturnValue(mockRefreshToken);

    const mockTokenManager: TokenManager = {
      generateAccessToken: mockGAccessTokenMethod,
      generateRefreshToken: mockGRefreshTokenMethod
    } as Partial<jest.Mocked<TokenManager>> as TokenManager;

    const mockSRefreshTokenMethod = jest.fn();

    const mockTokenStore: TokenStore = {
      storeRefreshToken: mockSRefreshTokenMethod
    } as Partial<jest.Mocked<TokenStore>> as TokenStore;

    const loginUseCase = new LoginUseCase(mockTokenManager, mockTokenStore);

    const result = await loginUseCase.execute(fakePayload);

    expect(mockGAccessTokenMethod).toHaveBeenCalledWith(fakePayload);
    expect(mockGRefreshTokenMethod).toHaveBeenCalledWith(fakePayload);
    expect(mockSRefreshTokenMethod).toHaveBeenCalledWith(fakePayload.userId, mockRefreshToken);
    expect(result).toEqual({ 
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken 
    } satisfies JwtTokenDTO);
  });
});
