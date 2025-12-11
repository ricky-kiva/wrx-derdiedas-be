import 'reflect-metadata';

import { ServiceUnavailableError } from '../../../../commons/exceptions';
import WinstonLoggerService from '../WinstonLoggerService';

describe('WinstonLoggerService', () => {
  let service: WinstonLoggerService;

  const message = 'test message';
  const meta = { foo: 'bar' };

  beforeEach(() => {
    service = new WinstonLoggerService();

    service['logger'].info = jest.fn();
    service['logger'].warn = jest.fn();
    service['logger'].error = jest.fn();
  });

  it('should call `.info` with correct arguments', () => {
    service.info(message, meta);
    expect(service['logger'].info).toHaveBeenCalledWith(message, meta);
  });

  it('should call `.warn` with correct arguments', () => {
    service.warn(message, meta);
    expect(service['logger'].warn).toHaveBeenCalledWith(message, meta);
  });

  it('should call `.error` with correct arguments', () => {
    const error = new ServiceUnavailableError(message);

    service.error(message, error);

    expect(service['logger'].error)
      .toHaveBeenCalledWith(message, error);
  });

  it('should provide default message in `.info` & `.warn`', () => {
    service.info();
    service.warn();

    expect(service['logger'].info).toHaveBeenCalledWith('INFO', undefined);
    expect(service['logger'].warn).toHaveBeenCalledWith('WARN', undefined);
  });
});