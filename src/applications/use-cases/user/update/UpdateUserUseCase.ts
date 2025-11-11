import { NotFoundError } from '../../../../commons/exceptions';
import User from '../../../../domains/user/entities/User';
import UserRepository from '../../../../domains/user/UserRepository';
import { UpdateUserCmd } from './commands/UpdateUserCmd';

export default class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(cmd: UpdateUserCmd): Promise<User> {
    const updatedUser = await this.userRepository.update(cmd.id, cmd.payload);

    if (!updatedUser) throw new NotFoundError('User not found');

    return updatedUser;
  }
}
