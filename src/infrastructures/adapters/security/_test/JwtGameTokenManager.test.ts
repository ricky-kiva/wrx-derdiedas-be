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

  it('verifyGameToken should pass for a valid token', () => {
    expect(() => tokenManager.verifyGameToken(token)).not.toThrow();
  });

  it('verifyGameToken should throw InvariantError for a token signed with wrong secret', () => {
    const invalidToken = jwt.sign(payload, 'wrong-secret');
    expect(() => tokenManager.verifyGameToken(invalidToken)).toThrow(InvariantError);
  });

  it('verifyPayload should pass for a valid token', () => {
    expect(() => tokenManager.verifyPayload(token)).not.toThrow();
  });

  it('verifyPayload should throw InvariantError for malformed payload', () => {
    const malformedToken = jwt.sign({ notJti: 'oops' }, config.game.jwt.accessToken.secret);
    expect(() => tokenManager.verifyPayload(malformedToken)).toThrow(InvariantError);
  });

  it('verifyPayload should throw InvariantError for completely invalid token', () => {
    const invalidToken = 'this.is.not.a.jwt';
    expect(() => tokenManager.verifyPayload(invalidToken)).toThrow(InvariantError);
  });
});
