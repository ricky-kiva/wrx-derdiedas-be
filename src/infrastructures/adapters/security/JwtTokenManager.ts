import JwtPayloadDTO from '../../../applications/ports/security/dto/JwtPayloadDTO';
import TokenManager from '../../../applications/ports/security/TokenManager';
import jwt from 'jsonwebtoken';
import config from '../../../commons/config';
import { AuthenticationError } from '../../../commons/exceptions';

export default class JwtTokenManager implements TokenManager {
  generateAccessToken(payload: JwtPayloadDTO): string {
    return jwt.sign(payload, config.jwt.accessToken.secret, { expiresIn: config.jwt.accessToken.expiry });
  }

  generateRefreshToken(payload: JwtPayloadDTO): string {
    return jwt.sign(payload, config.jwt.refreshToken.secret, { expiresIn: config.jwt.refreshToken.expiry });
  }

  verifyRefreshToken(token: string): void {
    try {
      jwt.verify(token, config.jwt.refreshToken.secret);
    } catch {
      throw new AuthenticationError('Invalid refresh token');
    }
  }

  decodePayload(token: string): JwtPayloadDTO {
    const decoded = jwt.decode(token);

    if (!decoded || typeof decoded !== 'object') {
      throw new AuthenticationError('Invalid JWT payload');
    }

    if (!('userId' in decoded) || typeof decoded.userId !== 'string') {
      throw new AuthenticationError('Invalid JWT payload');
    }

    return { 
      userId: decoded.userId 
    } satisfies JwtPayloadDTO;
  }
}
