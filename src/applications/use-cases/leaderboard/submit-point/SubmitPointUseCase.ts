import { AuthenticationError, InvariantError, NotFoundError } from '../../../../commons/exceptions';
import UserRepository from '../../../../domains/user/UserRepository';
import UserPointRepository from '../../../../domains/userPoint/UserPointRepository';
import SubmitPointCmd from './command/SubmitPointCmd';

export default class SubmitPointUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userPointRepository: UserPointRepository
  ) {}

  async execute(cmd: SubmitPointCmd): Promise<string> {
    let userId: string;

    if (cmd.userId) {
      const user = await this.userRepository.findById(cmd.userId);

      if (!user) throw new NotFoundError('User not found');
      if (!user.googleId) throw new AuthenticationError('Authentication is required to update existing score');

      userId = user.id;
    } else {
      if (!cmd.name) throw new InvariantError('Name is required for anonymous users');

      const user = await this.userRepository.create({ name: cmd.name });

      userId = user.id;
    }

    await this.userPointRepository.save({ 
      userId, 
      point: cmd.point, 
      updatedAt: cmd.updatedAt
    });

    return userId;
  }
}
