import { UserPointPayload } from './entities/UserPoint';

export default interface UserPointRepository {
  decrement(userId: string, amount?: number): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
  increment(userId: string, amount?: number): Promise<void>;
  save(payload: UserPointPayload): Promise<void>;
}
