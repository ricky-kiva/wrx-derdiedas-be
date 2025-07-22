import TokenStore from '../../ports/security/TokenStore';
import LogoutUseCase from '../LogoutUseCase';

describe('LogoutUseCase', () => {
  it('should delete refresh token for the given userId', async () => {
    const userId = 'user-123';

    const mockDRefreshTokenMethod = jest.fn().mockResolvedValue(undefined);
    
    const mockTokenStore: TokenStore = {
      deleteRefreshToken: mockDRefreshTokenMethod
    } as Partial<jest.Mocked<TokenStore>> as TokenStore;

    const logoutUseCase = new LogoutUseCase(mockTokenStore);

    await logoutUseCase.execute(userId);

    expect(mockDRefreshTokenMethod).toHaveBeenCalledWith(userId);
    expect(mockDRefreshTokenMethod).toHaveBeenCalled();
  });
});
