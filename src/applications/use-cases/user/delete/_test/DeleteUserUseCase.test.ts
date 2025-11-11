import { NotFoundError } from '../../../../../commons/exceptions';
import UserRepository from '../../../../../domains/user/UserRepository';
import DeleteUserUseCase from '../DeleteUserUseCase';

describe('DeleteUserUseCase', () => {
  const mockUserId = 'user-123';

  let mockUserRepository: jest.Mocked<UserRepository>;
  let deleteUserUseCase: DeleteUserUseCase;
  let mockURFindById: jest.Mock;
  let mockURDelete: jest.Mock;

  beforeEach(() => {
    mockURFindById = jest.fn();
    mockURDelete = jest.fn();

    mockUserRepository = {
      findById: mockURFindById,
      delete: mockURDelete,
    } as unknown as jest.Mocked<UserRepository>;

    deleteUserUseCase = new DeleteUserUseCase(mockUserRepository);
  });

  it('should delete user if found', async () => {
    mockURFindById.mockResolvedValue({ id: mockUserId, name: 'Rickyslash' });

    await deleteUserUseCase.execute(mockUserId);

    expect(mockURFindById).toHaveBeenCalledWith(mockUserId);
    expect(mockURDelete).toHaveBeenCalledWith(mockUserId);
  });

  it('should throw NotFoundError if user not found', async () => {
    mockURFindById.mockResolvedValue(null);

    await expect(deleteUserUseCase.execute(mockUserId))
      .rejects.toThrow(NotFoundError);

    expect(mockURDelete).not.toHaveBeenCalled();
  });
});
