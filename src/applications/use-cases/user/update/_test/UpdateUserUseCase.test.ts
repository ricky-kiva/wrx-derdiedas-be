import { NotFoundError } from '../../../../../commons/exceptions';
import UserRepository from '../../../../../domains/user/UserRepository';
import UpdateUserUseCase from '../UpdateUserUseCase';
import { UpdateUserCmd } from '../commands/UpdateUserCmd';
import User from '../../../../../domains/user/entities/User';

describe('UpdateUserUseCase', () => {
  const mockId = 'user-123';
  const mockNewName = 'Rickyslash';
  const mockCmd: UpdateUserCmd = { 
    id: mockId, 
    payload: { name: mockNewName } 
  };

  let mockUserRepository: jest.Mocked<UserRepository>;
  let updateUserUseCase: UpdateUserUseCase;
  let mockURUpdate: jest.Mock;

  beforeEach(() => {
    mockURUpdate = jest.fn();

    mockUserRepository = {
      update: mockURUpdate,
    } as unknown as jest.Mocked<UserRepository>;

    updateUserUseCase = new UpdateUserUseCase(mockUserRepository);
  });

  it('should update user name and return updated user', async () => {
    const updatedUser = new User({ id: mockId, name: mockNewName });
    mockUserRepository.update.mockResolvedValue(updatedUser);

    const result = await updateUserUseCase.execute(mockCmd);

    expect(mockURUpdate).toHaveBeenCalledWith(mockId, { name: mockNewName });
    expect(result).toBe(updatedUser);
  });

  it('should throw NotFoundError when user not found', async () => {
    mockUserRepository.update.mockResolvedValue(null);

    await expect(updateUserUseCase.execute(mockCmd)).rejects.toThrow(NotFoundError);

    expect(mockURUpdate).toHaveBeenCalledWith(mockId, { name: mockNewName });
  });
});
