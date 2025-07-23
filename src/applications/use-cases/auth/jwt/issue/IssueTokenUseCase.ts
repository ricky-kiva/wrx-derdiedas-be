import JwtPayloadDTO from '../../../../ports/security/dto/JwtPayloadDTO';
import JwtTokenDTO from '../../../../ports/security/dto/JwtTokenDTO';
import TokenManager from '../../../../ports/security/TokenManager';
import TokenStore from '../../../../ports/security/TokenStore';

export default class IssueTokenUseCase {
  constructor(
    private readonly tokenManager: TokenManager, 
    private readonly tokenStore: TokenStore
  ) {}

  async execute(payload: JwtPayloadDTO): Promise<JwtTokenDTO>  {
    const accessToken = this.tokenManager.generateAccessToken(payload);
    const refreshToken = this.tokenManager.generateRefreshToken(payload);
    
    await this.tokenStore.storeRefreshToken(payload.userId, refreshToken);
    
    return { accessToken, refreshToken } satisfies JwtTokenDTO;
  }
}
