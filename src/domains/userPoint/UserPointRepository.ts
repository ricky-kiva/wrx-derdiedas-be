import UserPoint, { UserPointPayload } from './entities/UserPoint';

export default interface UserPointRepository {
  findByUserId(userId: string): Promise<UserPoint | null>;
  save(payload: UserPointPayload): Promise<void>;
}
