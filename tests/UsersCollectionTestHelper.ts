/* istanbul ignore file */

import User, { UserPayload } from '../src/domains/user/entities/User';
import UserMapper from '../src/infrastructures/database/mongoose/mappers/UserMapper';
import UserModel from '../src/infrastructures/database/mongoose/models/UserModel';

const userPayloads: UserPayload[] = [
  { name: 'Rickyslash', googleId: 'g-123', email: 'r@gmail.com', picture: 'https://p.com/rickyslash.png' },
  { name: 'Guts', googleId: 'g-124', email: 'g@gmail.com', picture: 'https://p.com/guts.png' },
  { name: 'Caska', googleId: 'g-125', email: 'c@gmail.com', picture: 'https://p.com/caska.png' },
  { name: 'Griffith', googleId: 'g-126', email: 'gr@gmail.com', picture: 'https://p.com/griffith.png' }
];

const UsersCollectionTestHelper = {
  async addUser(): Promise<User> {
    const doc = await UserModel.create(userPayloads[0]);
    return UserMapper.toDomain(doc);
  },
  async cleanCollection(): Promise<void> {
    await UserModel.deleteMany({});
  },
  getPayloads(): UserPayload[] {
    return userPayloads.map(p => ({ ...p })); 
  }
};

export default UsersCollectionTestHelper;
