import cors from 'cors';
import { CorsError } from '../../../../commons/exceptions';
import whitelist from '../../../../commons/whitelist';

export function originCallback(
  origin: string | undefined,
  callback: ((err: Error | null, allow?: boolean) => void)
) {
  if (!origin || whitelist.includes(origin)) callback(null, true); 
  else callback(new CorsError());
}

export default cors({ 
  origin: originCallback,
  credentials: true 
});
