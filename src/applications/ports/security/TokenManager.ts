import JwtPayloadDTO from '../../dto/JwtPayloadDTO';

export default interface TokenManager {
  generateAccessToken(payload: JwtPayloadDTO): string;
  generateRefreshToken(payload: JwtPayloadDTO): string;
  verifyRefreshToken(token: string): void;
  decodePayload(token: string): JwtPayloadDTO | null;
}
