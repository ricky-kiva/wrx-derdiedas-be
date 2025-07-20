import jwt from 'jsonwebtoken';
import JwtPayloadDTO from '../../../../applications/dto/JwtPayloadDTO';
import { AuthenticationError } from '../../../../commons/exceptions';
import JwtTokenManager from '../JwtTokenManager';
import config from '../../../../commons/config';

describe('JwtTokenManager', () => {
  let accessToken: string;
  let refreshToken: string;
  
  const tokenManager = new JwtTokenManager();

  const payload: JwtPayloadDTO = {
    userId: 'user-123',
    name: 'Rickyslash'
  };

  it('generateAccessToken should generate access token', () => {
    accessToken = tokenManager.generateAccessToken(payload);
    expect(typeof accessToken).toBe('string');
  });

  it('generateRefreshToken should generate refresh token', () => {
    refreshToken = tokenManager.generateRefreshToken(payload);
    expect(typeof refreshToken).toBe('string');
  });

  it('verifyRefreshToken should verify valid refresh token', () => {
    expect(() => tokenManager.verifyRefreshToken(refreshToken))
      .not.toThrow();
  });

  it('verifyRefreshToken should throw AuthenticationError on invalid refresh token', () => {
    const fakeToken = 'fake.token.value';
    expect(() => tokenManager.verifyRefreshToken(fakeToken)).toThrow(AuthenticationError);
  });

  it('decodePayload should decode valid payload', () => {
    const decoded = tokenManager.decodePayload(accessToken);
    expect(decoded).toEqual(expect.objectContaining(payload));
  });

  it('decodePayload should throw error if payload is invalid shape', () => {
    const badToken = jwt.sign({ foo: 'bar' }, config.jwt.accessToken.secret);
    const decodePayload = () => tokenManager.decodePayload(badToken);

    expect(decodePayload).toThrow(AuthenticationError);
  });
});
