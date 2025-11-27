import { Application } from 'express';
import request from 'supertest';
import ApiResponse from '../../../../../interfaces/http/types/ApiResponse';
import { NotFoundError } from '../../../../../commons/exceptions';
import HeaderUtils from '../../../../../interfaces/http/shared/HeaderUtils';
import { TestPartMocks } from '../mocks/useCases.mock.test.part';
import { UpdateUserDTO } from '../../../../../applications/use-cases/user/update/dto/UpdateUserDTO';

export default function testUserRoutes(
  getApp: () => Application,
  getMocks: () => TestPartMocks
) {
  const BASE_URL = '/users';
  const mockUserId = '507f1f77bcf86cd799439011';

  describe('User Routes Integration', () => {
    let app: Application;
    let mocks: TestPartMocks;

    beforeEach(() => {
      app = getApp();
      mocks = getMocks();

      jest.spyOn(HeaderUtils.prototype, 'extractUserId').mockImplementation(() => undefined);
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe('GET `/users/:id/points`', () => {
      it('responds with 200 and user points', async () => {
        const mockPoints = 42;

        mocks.usecases.getUserPointUC.execute.mockResolvedValue(mockPoints);

        const res = await request(app).get(`${BASE_URL}/${mockUserId}/points`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          status: 'success',
          data: { point: mockPoints }
        } satisfies ApiResponse);

        expect(mocks.methods.getUserPointUC.execute).toHaveBeenCalledWith(mockUserId);
      });

      it('responds with 404 if user not found', async () => {
        mocks.usecases.getUserPointUC.execute.mockRejectedValue(new NotFoundError('User not found'));

        const res = await request(app).get(`${BASE_URL}/${mockUserId}/points`);

        expect(res.status).toBe(404);
        expect(res.body).toMatchObject({
          status: 'fail',
          message: 'User not found'
        });
      });
    });

    describe('PATCH `/users/:id`', () => {
      it('responds with 200 and updated user', async () => {
        const mockUpdatedUser: UpdateUserDTO = { id: mockUserId, name: 'New Name', picture: 'old.picture' };

        mocks.usecases.updateUserUC.execute.mockResolvedValue(mockUpdatedUser);

        const res = await request(app)
          .patch(`${BASE_URL}/${mockUserId}`)
          .send({ name: mockUpdatedUser.name });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
          status: 'success',
          data: { ...mockUpdatedUser }
        } satisfies ApiResponse);

        expect(mocks.methods.updateUserUC.execute).toHaveBeenCalledWith({
          id: mockUserId,
          payload: { name: mockUpdatedUser.name }
        });
      });

      it('responds with 404 if user not found', async () => {
        mocks.usecases.updateUserUC.execute.mockRejectedValue(new NotFoundError('User not found'));

        const res = await request(app)
          .patch(`${BASE_URL}/${mockUserId}`)
          .send({ name: 'New Name' });

        expect(res.status).toBe(404);
        expect(res.body).toMatchObject({
          status: 'fail',
          message: 'User not found'
        });
      });
    });

    describe('DELETE `/users/:id`', () => {
      it('responds with 204 when deletion succeeds', async () => {
        mocks.usecases.deleteUserUC.execute.mockResolvedValue(undefined);

        const res = await request(app).delete(`${BASE_URL}/${mockUserId}`);

        expect(res.status).toBe(204);
        expect(mocks.methods.deleteUserUC.execute).toHaveBeenCalledWith(mockUserId);
      });

      it('responds with 404 if user not found', async () => {
        mocks.usecases.deleteUserUC.execute.mockRejectedValue(new NotFoundError('User not found'));

        const res = await request(app).delete(`${BASE_URL}/${mockUserId}`);

        expect(res.status).toBe(404);
        expect(res.body).toMatchObject({
          status: 'fail',
          message: 'User not found'
        });
      });
    });
  });
}
