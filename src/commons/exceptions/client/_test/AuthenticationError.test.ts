import { AuthenticationError } from '../AuthenticationError';

describe('AuthenticationError', () => {
  it('should create a correct error', () => {
    const errorMessage = 'an error occured';

    const authenticationError = new AuthenticationError(errorMessage);

    expect(authenticationError.statusCode).toEqual(401);
    expect(authenticationError.message).toEqual(errorMessage);
    expect(authenticationError.name).toEqual('AuthenticationError');
  });
});
