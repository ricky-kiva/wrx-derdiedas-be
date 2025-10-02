import { Application } from 'express';
import { TestPartMocks } from '../mocks/useCases.mock.test.part';
import JwtTokenDTO from '../../../../../applications/ports/security/dto/JwtTokenDTO';
import request from 'supertest';
import ApiResponse from '../../../../../interfaces/http/types/ApiResponse';
import { LoginPayload, LogoutPayload, RefreshTokenPayload } from '../../../../../interfaces/http/adapters/validation/auth/types';

export default function testAuthRoutes(
  getApp: () => Application,
  getMocks: () => TestPartMocks
) {
  describe('Auth Routes Integration', () => {
    const baseRoute = '/auth';

    let app: Application;
    let mocks: TestPartMocks;

    beforeEach(() => {
      app = getApp();
      mocks = getMocks();
    });

    it('responds to POST `/login` with token data', async () => {
      const mockToken: JwtTokenDTO = {
        accessToken: 'mock.access.token',
        refreshToken: 'mock.refresh.token'
      };

      mocks.usecases.loginUC.execute.mockResolvedValue(mockToken);

      const res = await request(app)
        .post(`${baseRoute}/login`)
        .send({ 
          googleIdToken: 'mock.google.token'
        } satisfies LoginPayload);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: 'success',
        data: mockToken
      } satisfies ApiResponse);
    });

    it('responds to POST `/logout` with 401', async () => {
      const payload = { id: 'user-123' } satisfies LogoutPayload;

      const res = await request(app)
        .post(`${baseRoute}/logout`)
        .send(payload);

      expect(res.status).toBe(401);
      expect(mocks.methods.logoutUC.execute).toHaveBeenCalledWith(payload.id);
    });

    it('responds to PORT `/refresh-token` with new tokens', async () => {
      const refreshedTokens: JwtTokenDTO = {
        accessToken: 'new.access.token',
        refreshToken: 'new.refresh.token'
      };

      mocks.usecases.refreshTokenUC.execute.mockResolvedValue(refreshedTokens);

      const res = await request(app)
        .post(`${baseRoute}/refresh-token`)
        .send({ refreshToken: 'old.refresh.token' } satisfies RefreshTokenPayload);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: 'success',
        data: refreshedTokens
      } satisfies ApiResponse);
    });

    it('responds with 400 for invalid payloads', async () => {
      const res = await request(app)
        .post(`${baseRoute}/login`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        status: 'fail',
        message: expect.any(String) as unknown as string
      } satisfies ApiResponse);
    });
  });
}
