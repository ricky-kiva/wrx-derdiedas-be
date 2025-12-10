import cors from 'cors';
import { CorsError } from '../../../../commons/exceptions';

const whitelist = [
  'http://derdiedas.my.id', 'https://derdiedas.my.id', 
  'http://www.derdiedas.my.id', 'https://www.derdiedas.my.id', 
  'http://localhost:5173', 'http://142.171.191.162'
];

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

export default cors({ 
  origin: originCallback,
  credentials: true 
});
