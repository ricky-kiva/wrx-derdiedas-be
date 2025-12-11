import { AuthenticationError, NotFoundError } from '../../../../commons/exceptions';
import UserRepository from '../../../../domains/user/UserRepository';
import { UpdateUserCmd } from './commands/UpdateUserCmd';
import { UpdateUserDTO } from './dto/UpdateUserDTO';

export default class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(cmd: UpdateUserCmd): Promise<UpdateUserDTO> {
    if (!cmd.id) throw new AuthenticationError("Invalid or expired token");

    const updatedUser = await this.userRepository.update(cmd.id, cmd.payload);

    if (!updatedUser) throw new NotFoundError('User not found');

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      picture: updatedUser.picture
    } satisfies UpdateUserDTO;
  }
}
