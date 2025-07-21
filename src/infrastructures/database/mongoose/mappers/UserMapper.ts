import User from '../../../../domains/user/entities/User';
import { UserDocument } from '../models/UserModel';

export default class UserMapper {
  static toDomain(doc: UserDocument): User {
    return new User({
      id: doc._id.toString(),
      name: doc.name,
      googleId: doc.googleId,
      email: doc.email,
      picture: doc.picture
    });
  }
}
