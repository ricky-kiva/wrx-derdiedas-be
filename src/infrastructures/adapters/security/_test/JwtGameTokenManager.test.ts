import jwt from 'jsonwebtoken';
import JwtGamePayloadDTO from '../../../../applications/ports/security/dto/JwtGamePayloadDTO';
import { InvariantError } from '../../../../commons/exceptions';
import JwtGameTokenManager from '../JwtGameTokenManager';
import config from '../../../../commons/config';

describe('JwtGameTokenManager', () => {
  let token: string;
  const tokenManager = new JwtGameTokenManager();

  const payload: JwtGamePayloadDTO = { jti: 'game-123' };

  it('generateAccessToken should generate a string token', () => {
    token = tokenManager.generateAccessToken(payload);
    expect(typeof token).toBe('string');
  });

  it('decodePayload should decode a valid token', () => {
    const decoded = tokenManager.decodePayload(token);
    expect(decoded).toEqual(expect.objectContaining(payload));
  });

  it('decodePayload should throw InvariantError for invalid token', () => {
    const invalidToken = jwt.sign({ foo: 'bar' }, 'wrong-secret');
    expect(() => tokenManager.decodePayload(invalidToken)).toThrow(InvariantError);
  });

  it('decodePayload should throw InvariantError for malformed payload', () => {
    const malformedToken = jwt.sign({ notJti: 'oops' }, config.game.jwt.accessToken.secret);
    expect(() => tokenManager.decodePayload(malformedToken)).toThrow(InvariantError);
  });
});
