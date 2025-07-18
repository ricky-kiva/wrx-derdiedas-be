import JwtPayloadDTO from '../../../applications/dto/JwtPayloadDTO';
import TokenManager from '../../../applications/ports/security/TokenManager';
import jwt from 'jsonwebtoken';
import config from '../../../commons/config';
import { InvariantError } from '../../../commons/exceptions';
import { isJwtPayloadDTO } from '../../validation/security/typeguards';

export default class JwtTokenManager implements TokenManager {
  generateAccessToken(payload: JwtPayloadDTO): string {
    return jwt.sign(payload, config.jwt.accessTokenSecret, { expiresIn: '15m' });
  }

  generateRefreshToken(payload: JwtPayloadDTO): string {
    return jwt.sign(payload, config.jwt.refreshTokenSecret, { expiresIn: '30d' });
  }

  verifyRefreshToken(token: string): void {
    try {
      jwt.verify(token, config.jwt.refreshTokenSecret);
    } catch {
      throw new InvariantError('Invalid refresh token');
    }
  }

  decodePayload(token: string): JwtPayloadDTO | null {
    const decoded = jwt.decode(token);

    if (isJwtPayloadDTO(decoded)) {
      return decoded;
    }

    return null;
  }
}
