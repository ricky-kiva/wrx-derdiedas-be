import UserPoint, { UserPointPayload } from './entities/UserPoint';

export default interface UserPointRepository {
  decrement(userId: string, amount?: number): Promise<void>;
  findByUserId(userId: string): Promise<UserPoint | null>;
  increment(userId: string, amount?: number): Promise<void>;
  save(payload: UserPointPayload): Promise<void>;
}
