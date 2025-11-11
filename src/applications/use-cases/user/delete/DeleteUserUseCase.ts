import { NotFoundError } from '../../../../commons/exceptions';
import UserRepository from '../../../../domains/user/UserRepository';

export default class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (!user) throw new NotFoundError("User not found");

    await this.userRepository.delete(id);
  }
}
