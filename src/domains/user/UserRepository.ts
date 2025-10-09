import User, { UserPayload } from './entities/User';

export default interface UserRepository {
  create(payload: UserPayload): Promise<User>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByGoogleId(googleId: string): Promise<User | null>;
  findByName(name: string): Promise<User | null>;
}
