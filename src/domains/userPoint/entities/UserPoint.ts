export interface UserPointPayload {
  userId: string;
  point: number;
  updatedAt: Date;
}

export type UserPointParams = UserPointPayload;

export default class UserPoint {
  public readonly userId: string;
  public point: number;
  public updatedAt: Date;

  constructor(params: UserPointParams) {
    const { userId, point, updatedAt } = params;

    this.userId = userId;
    this.point = point;
    this.updatedAt = updatedAt;
  }
}
