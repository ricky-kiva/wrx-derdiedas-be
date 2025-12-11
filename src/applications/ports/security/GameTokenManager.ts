import JwtGamePayloadDTO from './dto/JwtGamePayloadDTO';

export default interface GameTokenManager {
  generateAccessToken(payload: JwtGamePayloadDTO): string;
  verifyGameToken(token: string): void;
  verifyPayload(token: string): void;
}
