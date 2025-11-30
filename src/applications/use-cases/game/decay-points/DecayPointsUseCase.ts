import UserRepository from '../../../../domains/user/UserRepository';
import { USER_POINT_CONSTANTS } from '../../../../domains/userPoint/constants/userPointConstants';
import UserPointRepository from '../../../../domains/userPoint/UserPointRepository';
import { UserPointQueryRepository } from '../../../query-repositories/user-point/UserPointQueryRepository';

export default class DecayPointsUseCase {
  constructor(
    private readonly userPointQueryRepository: UserPointQueryRepository,
    private readonly userPointRepository: UserPointRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(): Promise<void> {
    const userPoints = await this.userPointQueryRepository.findAll();

    const threshold = new Date();

    threshold.setDate(threshold.getDate() - 7);

    for (const up of userPoints) {
      if (up.updatedAt <= threshold) {
        if (up.point <= USER_POINT_CONSTANTS.DECAY_POINT) {
          const user = await this.userRepository.findById(up.userId);

          if (user && !user.email) {
            await this.userPointRepository.deleteByUserId(user.id);
            await this.userRepository.delete(user.id);
          } else {
            await this.userPointRepository.decrement(up.userId, up.point, false);
          }
        } else {
          await this.userPointRepository.decrement(up.userId, USER_POINT_CONSTANTS.DECAY_POINT, false);
        }
      }
    }
  }
}
