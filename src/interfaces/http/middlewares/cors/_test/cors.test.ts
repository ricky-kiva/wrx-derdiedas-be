import { CorsError } from '../../../../../commons/exceptions';
import { originCallback } from '../cors';

describe('CORS Middleware\'s Origin Callback', () => {
  test('allows requests with no origin (e.g. curl, server-to--server)', done => {
    originCallback(undefined, (err, allowed) => {
      expect(err).toBeNull();
      expect(allowed).toBe(true);
      done();
    });
  });

  test('allows requests from whitelisted origin', done => {
    originCallback('http://derdiedas.my.id', (err, allowed) => {
      expect(err).toBeNull();
      expect(allowed).toBe(true);
      done();
    });
  });

  test('rejects requests from non-whitelisted origin', done => {
    originCallback('http://bad-origin.com', (err, allowed) => {
      expect(err).toBeInstanceOf(CorsError);
      expect(allowed).toBeUndefined();
      done();
    });
  });
});
