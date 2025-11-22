import JwtTokenDTO from '../../../../ports/security/dto/JwtTokenDTO';
import TokenManager from '../../../../ports/security/TokenManager';
import TokenStore from '../../../../ports/security/TokenStore';

export default class RefreshTokenUseCase {
  constructor(
    private readonly tokenManager: TokenManager,
    private readonly tokenStore: TokenStore
  ) {}

  async execute(refreshToken: string): Promise<JwtTokenDTO | null> {
    this.tokenManager.verifyRefreshToken(refreshToken);

    const jwtPayload = this.tokenManager.decodePayload(refreshToken);

    const isValid = await this.tokenStore.verifyStoredRefreshToken(jwtPayload.userId, refreshToken);

    if (!isValid) return null; 

    const newAccessToken = this.tokenManager.generateAccessToken(jwtPayload);
    const newRefreshToken = this.tokenManager.generateRefreshToken(jwtPayload);

    await this.tokenStore.storeRefreshToken(jwtPayload.userId, newRefreshToken);

    return { 
      accessToken: newAccessToken, 
      refreshToken: newRefreshToken 
    } satisfies JwtTokenDTO;
  }
}
