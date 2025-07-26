import { Application } from 'express';
import request from 'supertest';
import ApiResponse from '../../../../../interfaces/http/types/ApiResponse';

export default function testNotFoundMW(getApp: () => Application) {
  describe('Not Found Middleware Integration', () => {
    let app: Application;
    
    beforeEach(() => {
      app = getApp();
    });

    it('responds with 404 for unregistered routes', async () => {
        const res = await request(app).get('/nonexsistent/route');
    
        expect(res.status).toBe(404);
        expect(res.body).toEqual({
          status: 'fail',
          message: 'route not found'
        } satisfies ApiResponse);
      });
  });
}
