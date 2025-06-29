import cors from 'cors';
import { CorsError } from '../../../../commons/exceptions';

const whitelist = ['http://localhost:5173'];

export function originCallback(
  origin: string | undefined,
  callback: ((err: Error | null, allow?: boolean) => void)
) {
  if (!origin || whitelist.includes(origin)) {
    callback(null, true);
  } else {
    callback(new CorsError());
  }
}

export default cors({ origin: originCallback });
