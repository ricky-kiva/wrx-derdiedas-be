import JwtPayloadDTO from '../dto/JwtPayloadDTO';
import JwtTokenDTO from '../dto/JwtTokenDTO';
import TokenManager from '../ports/security/TokenManager';
import TokenStore from '../ports/security/TokenStore';

export default class LoginUseCase {
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
