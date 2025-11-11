import { NotFoundError } from '../../../../commons/exceptions';
import UserRepository from '../../../../domains/user/UserRepository';
import { UpdateUserNameCmd } from './commands/UpdateUserNameCmd';

export default class UpdateUserNameUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(cmd: UpdateUserNameCmd): Promise<void> {
    const user = await this.userRepository.findById(cmd.id);

    if (!user) throw new NotFoundError('User not found');

    await this.userRepository.updateName(user.id, cmd.name);
  }
}
