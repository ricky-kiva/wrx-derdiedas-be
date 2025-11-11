import { NotFoundError } from '../../../../commons/exceptions';
import UserRepository from '../../../../domains/user/UserRepository';
import { UserPointQueryRepository } from '../../../query-repositories/user-point/UserPointQueryRepository';

export default class GetUserPointUseCase {
  constructor(
    private readonly userPointQueryRepository: UserPointQueryRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(userId: string): Promise<number> {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new NotFoundError("User not found");

    const userPoint = await this.userPointQueryRepository.findByUserId(user.id);

    if (!userPoint) throw new NotFoundError("User point not found");

    return userPoint.point;
  }
}
