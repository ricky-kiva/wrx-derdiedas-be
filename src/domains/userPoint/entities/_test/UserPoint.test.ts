import UserPoint, { UserPointParams, UserPointPayload } from '../UserPoint';

describe('UserPoint', () => {
  it('should create UserPoint correctly', () => {
    const payload: UserPointPayload = { userId: 'user-123', point: 69 };
    const params: UserPointParams = payload;

    const userPoint = new UserPoint(params);

    expect(userPoint.userId).toBe(params.userId);
    expect(userPoint.point).toBe(params.point);
  });

  it('should accept 0 as a valid Point value', () => {
    const userPoint = new UserPoint({ userId: 'user-123', point: 0 });

    expect(userPoint.point).toBe(0);
  });
});
