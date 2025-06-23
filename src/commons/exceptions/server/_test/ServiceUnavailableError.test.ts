import { ServiceUnavailableError } from '../ServiceUnavailableError';

describe('ServiceUnavailableError', () => {
  it('should create a correct error', () => {
    const errorMessage = 'an error occured';

    const serviceUnavailableError = new ServiceUnavailableError(errorMessage);

    expect(serviceUnavailableError.statusCode).toEqual(404);
    expect(serviceUnavailableError.message).toEqual(errorMessage);
    expect(serviceUnavailableError.name).toEqual('ServiceUnavailableError');
  });
});
