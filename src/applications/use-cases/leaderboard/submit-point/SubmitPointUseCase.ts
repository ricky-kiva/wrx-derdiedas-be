import { AuthenticationError, InvariantError, NotFoundError } from '../../../../commons/exceptions';
import UserRepository from '../../../../domains/user/UserRepository';
import UserPointRepository from '../../../../domains/userPoint/UserPointRepository';
import SubmitPointRequestDTO from './dto/SubmitPointRequestDTO';

export default class SubmitPointUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userPointRepository: UserPointRepository
  ) {}

  async execute(req: SubmitPointRequestDTO): Promise<string> {
    let userId: string;

    if (!req.updatedAt) throw new InvariantError('updatedAt is required to store point');

    if (req.userId) {
      const user = await this.userRepository.findById(req.userId);

      if (!user) throw new NotFoundError('User not found');
      if (!user.googleId) throw new AuthenticationError('Authentication is required to update existing score');

      userId = user.id;
    } else {
      if (!req.name) throw new InvariantError('Name is required for anonymous users');

      const user = await this.userRepository.create({ name: req.name });

      userId = user.id;
    }

    await this.userPointRepository.save({ 
      userId, 
      point: req.point, 
      updatedAt: req.updatedAt
    });

    return userId;
  }
}
