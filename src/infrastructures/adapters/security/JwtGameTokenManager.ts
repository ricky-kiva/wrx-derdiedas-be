import jwt from 'jsonwebtoken';
import JwtGamePayloadDTO from '../../../applications/ports/security/dto/JwtGamePayloadDTO';
import GameTokenManager from '../../../applications/ports/security/GameTokenManager';
import { InvariantError } from '../../../commons/exceptions';
import config from '../../../commons/config';

export default class JwtGameTokenManager implements GameTokenManager {
  generateAccessToken(payload: JwtGamePayloadDTO): string {
    const gameJwtConfig = config.game.jwt.accessToken;
    return jwt.sign(payload, gameJwtConfig.secret, { expiresIn: gameJwtConfig.expiry });
  }

  verifyGameToken(token: string): void {
    try {
      jwt.verify(token, config.game.jwt.accessToken.secret);
    } catch {
      throw new InvariantError('Invalid game token');
    }
  }
  
  verifyPayload(token: string) {
    const decoded = jwt.decode(token);
        
    if (!decoded || typeof decoded !== 'object') {
      throw new InvariantError('Invalid JWT payload');
    }

    if (!('jti' in decoded) || typeof decoded.jti !== 'string') {
      throw new InvariantError('Invalid JWT payload');
    }
  }
}
