import User, { UserPayload } from '../src/domains/user/entities/User';
import UserMapper from '../src/infrastructures/database/mongoose/mappers/UserMapper';
import UserModel from '../src/infrastructures/database/mongoose/models/UserModel';

const payload: UserPayload = {
  name: 'Rickyslash',
  googleId: 'g-123',
  email: 'r@gmail.com',
  picture: 'https://p.com/rickyslash.png'
};

const UsersCollectionTestHelper = {
  async addUser(): Promise<User> {
    const doc = await UserModel.create(payload);
    return UserMapper.toDomain(doc);
  },
  async cleanCollection(): Promise<void> {
    await UserModel.deleteMany({});
  },
  getPayload(): UserPayload {
    return payload;
  }
};

export default UsersCollectionTestHelper;
