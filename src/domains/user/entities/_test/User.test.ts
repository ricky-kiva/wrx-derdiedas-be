import User, { UserParams, UserPayload } from '../User';

describe('User', () => {
  it('should create User correctly with all fields', () => {
    const payload: UserPayload = {
      username: 'rickyslash',
      googleId: 'google-123'
    };

    const params: UserParams = { ...payload, id: 'user-123' };

    const user = new User(params);

    expect(user.id).toBe(params.id);
    expect(user.username).toBe(params.username);
    expect(user.googleId).toBe(params.googleId);
  });

  it('should create User without googleId', () => {
    const payload: UserPayload = { username: 'rickyslash' };
    const params: UserParams = { ...payload, id: 'user-123' };

    const user = new User(params);

    expect(user.id).toBe(params.id);
    expect(user.username).toBe(params.username);
    expect(user.googleId).toBeUndefined();
  });
});
