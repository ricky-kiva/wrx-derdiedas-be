import UserPoint from '../../../../domains/userPoint/entities/UserPoint';
import { UserPointDocument } from '../models/UserPointModel';

export default class UserPointMapper {
  static toDomain(doc: UserPointDocument): UserPoint {
    return new UserPoint({
      userId: doc.userId.toString(),
      point: doc.point,
      updatedAt: doc.updatedAt
    });
  }
}
