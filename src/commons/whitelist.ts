import config from './config';

const prodWhitelist = [
  'http://derdiedas.my.id',
  'https://derdiedas.my.id',
  'http://www.derdiedas.my.id',
  'https://www.derdiedas.my.id',
  'http://142.171.191.162'
];

const devWhitelist = [
  'http://localhost:5173',
];

export default (process.env.NODE_ENV === config.env.development)
  ? [...prodWhitelist, ...devWhitelist]
  : prodWhitelist;
