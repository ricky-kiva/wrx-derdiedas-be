import { CorsError } from '../CorsError';

describe('CorsError', () => {
  it('should create a correct error', () => {
    const errorMessage = 'an error occured';

    const err = new CorsError(errorMessage);

    expect(err.statusCode).toEqual(403);
    expect(err.message).toEqual(errorMessage);
    expect(err.name).toEqual('CorsError');
  });
});
