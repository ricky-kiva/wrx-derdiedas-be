import JwtGamePayloadDTO from './dto/JwtGamePayloadDTO';

export default interface GameTokenManager {
  generateAccessToken(payload: JwtGamePayloadDTO): string;
  decodePayload(token: string): JwtGamePayloadDTO;
}
