import { NotFoundError } from '../../../../commons/exceptions';
import UserRepository from '../../../../domains/user/UserRepository';
import UserPointRepository from '../../../../domains/userPoint/UserPointRepository';

export default class DeleteUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userPointRepository: UserPointRepository
  ) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (!user) throw new NotFoundError("User not found");

    await this.userPointRepository.deleteByUserId(id);
    await this.userRepository.delete(id);
  }
}
