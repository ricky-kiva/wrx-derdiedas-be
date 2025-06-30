import express from 'express';
import request from 'supertest';
import helmet from '../helmet';

describe('Helmet Middleware', () => {
  const app = express();
  const rootPath = '/';

  app.use(helmet);

  app.get(rootPath, (_, res) => { res.send('ok'); });

  it('should set security headers', async () => {
    const res = await request(app).get(rootPath);

    expect(res.headers['x-dns-prefetch-control']).toBe('off');
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['strict-transport-security']).toBeDefined();
  });
});
