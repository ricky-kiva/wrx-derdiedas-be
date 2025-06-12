import { NotFoundError } from '../NotFoundError';

describe('NotFoundError', () => {
  it('should create a correct error', () => {
    const errorMessage = 'an error occured';

    const notFoundError = new NotFoundError(errorMessage);

    expect(notFoundError.statusCode).toEqual(404);
    expect(notFoundError.message).toEqual(errorMessage);
    expect(notFoundError.name).toEqual('NotFoundError');
  });
});
