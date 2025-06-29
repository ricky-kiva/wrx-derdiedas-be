import { ClientError } from './ClientError';

export class CorsError extends ClientError {
  constructor(message: string='not allowed by CORS') {
    super(message, 403);
  }
}
