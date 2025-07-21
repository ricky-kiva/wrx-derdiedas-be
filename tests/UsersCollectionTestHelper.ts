import { UserPayload } from '../src/domains/user/entities/User';
import UserModel from '../src/infrastructures/database/mongoose/models/UserModel';

const userPayload: UserPayload = {
  name: 'Rickyslash',
  googleId: 'g-123',
  email: 'r@gmail.com',
  picture: 'https://p.com/rickyslash.png'
};

const UsersCollectionTestHelper = {
  async cleanCollection(): Promise<void> {
    await UserModel.deleteMany({});
  },
  getPayload(): UserPayload {
    return userPayload;
  }
};

export default UsersCollectionTestHelper;
