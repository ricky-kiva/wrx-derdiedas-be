import { Application } from 'express';
import request from 'supertest';
import { ServiceInfoResponse } from '../../../../interfaces/http/types/ServiceInfoResponse';

export default function testRootRoutes(getApp: () => Application) {
  describe('Root Routes Integration', () => {
    it('responds to GET / with service info', async () => {
      const app = getApp();

      const res = await request(app).get('/');
  
      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining<ServiceInfoResponse>({
          status: 'success',
          service: 'derdiedas_be',
          version: expect.stringMatching(/^\d+\.\d+\.\d+$/) as unknown as string,
          message: expect.any(String) as unknown as string 
        })
      );
    });
  });
}
