import UserPoint from '../../../domains/userPoint/entities/UserPoint';

export interface UserPointQueryRepository {
  findAll(): Promise<UserPoint[]>;
  findByUserId(userId: string): Promise<UserPoint | null>;
}
