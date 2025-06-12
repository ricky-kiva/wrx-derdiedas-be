import { InvariantError } from '../InvariantError';

describe('InvariantError', () => {
  it('should create a correct error', () => {
    const errorMessage = 'an error occured';

    const invariantError = new InvariantError(errorMessage);

    expect(invariantError.statusCode).toEqual(400);
    expect(invariantError.message).toEqual(errorMessage);
    expect(invariantError.name).toEqual('InvariantError');
  });
});
