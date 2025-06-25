import { ServerError } from './ServerError';

export class ServiceUnavailableError extends ServerError {
  constructor(message: string) {
    super(message, 503);
  }
}
