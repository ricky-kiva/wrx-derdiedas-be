import { Application } from 'express';
import { TestPartMocks } from '../mocks/useCases.mock.test.part';
import JwtTokenDTO from '../../../../../applications/ports/security/dto/JwtTokenDTO';
import request from 'supertest';
import ApiResponse from '../../../../../interfaces/http/types/ApiResponse';
import { LoginPayload, LogoutPayload } from '../../../../../interfaces/http/adapters/validation/auth/types';
import { LoginDTO } from '../../../../../applications/use-cases/auth/dto/LoginDTO';

export default function testAuthRoutes(
  getApp: () => Application,
  getMocks: () => TestPartMocks
) {
  describe('Auth Routes Integration', () => {
    const baseRoute = '/auth';
    const mockUserId = '507f1f77bcf86cd799439012';

    let app: Application;
    let mocks: TestPartMocks;

    beforeEach(() => {
      app = getApp();
      mocks = getMocks();
    });

    it('responds to POST `/login` with token & user data', async () => {
      const mockLoginDTO: LoginDTO = {
        jwt: {
          accessToken: 'mock.access.token',
          refreshToken: 'mock.refresh.token'
        },
        user: {
          id: mockUserId,
          email: 'r@g.com',
          name: 'Rickyslash'
        }
      };

      mocks.usecases.loginUC.execute.mockResolvedValue(mockLoginDTO);

      const res = await request(app)
        .post(`${baseRoute}/login`)
        .send({ 
          googleIdToken: 'mock.google.token'
        } satisfies LoginPayload);

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: 'success',
        data: {
          accessToken: mockLoginDTO.jwt.accessToken,
          user: mockLoginDTO.user
        }
      } satisfies ApiResponse);
    });

    it('responds to POST `/logout` with 204', async () => {
      const payload = { id: mockUserId } satisfies LogoutPayload;

      const res = await request(app)
        .post(`${baseRoute}/logout`)
        .send(payload);

      expect(res.status).toBe(204);
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
        .set('Cookie', 'refreshToken=old.refresh.token');

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        status: 'success',
        data: { accessToken: refreshedTokens.accessToken }
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
