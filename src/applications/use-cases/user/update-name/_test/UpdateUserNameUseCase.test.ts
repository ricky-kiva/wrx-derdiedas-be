import { NotFoundError } from '../../../../../commons/exceptions';
import UserRepository from '../../../../../domains/user/UserRepository';
import UpdateUserNameUseCase from '../UpdateUserNameUseCase';
import { UpdateUserNameCmd } from '../commands/UpdateUserNameCmd';

describe('UpdateUserNameUseCase', () => {
  const mockId = 'user-123';
  const mockNewName = 'Rickyslash';
  const mockCmd: UpdateUserNameCmd = { id: mockId, name: mockNewName };

  let mockUserRepository: jest.Mocked<UserRepository>;
  let updateUserNameUseCase: UpdateUserNameUseCase;
  let mockURFindById: jest.Mock;
  let mockURUpdateName: jest.Mock;

  beforeEach(() => {
    mockURFindById = jest.fn();
    mockURUpdateName = jest.fn();

    mockUserRepository = {
      findById: mockURFindById,
      updateName: mockURUpdateName
    } as unknown as jest.Mocked<UserRepository>;

    updateUserNameUseCase = new UpdateUserNameUseCase(mockUserRepository);
  });

  it('should update user name when user exists', async () => {
    mockUserRepository.findById.mockResolvedValue({ id: mockId, name: 'OldName' });

    await updateUserNameUseCase.execute(mockCmd);

    expect(mockURFindById).toHaveBeenCalledWith(mockId);
    expect(mockURUpdateName).toHaveBeenCalledWith(mockId, mockNewName);
  });

  it('should throw NotFoundError when user not found', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(updateUserNameUseCase.execute(mockCmd))
      .rejects.toThrow(NotFoundError);

    expect(mockURUpdateName).not.toHaveBeenCalled();
  });
});
