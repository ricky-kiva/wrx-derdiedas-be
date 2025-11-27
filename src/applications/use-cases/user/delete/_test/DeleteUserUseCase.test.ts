import { NotFoundError } from '../../../../../commons/exceptions';
import UserRepository from '../../../../../domains/user/UserRepository';
import UserPointRepository from '../../../../../domains/userPoint/UserPointRepository';
import DeleteUserUseCase from '../DeleteUserUseCase';

describe('DeleteUserUseCase', () => {
  const mockUserId = 'user-123';

  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockUserPointRepository: jest.Mocked<UserPointRepository>;
  let deleteUserUseCase: DeleteUserUseCase;
  let mockURFindById: jest.Mock;
  let mockURDelete: jest.Mock;
  let mockUPRDeleteByUId: jest.Mock;

  beforeEach(() => {
    mockURFindById = jest.fn();
    mockURDelete = jest.fn();
    mockUPRDeleteByUId = jest.fn();

    mockUserRepository = {
      findById: mockURFindById,
      delete: mockURDelete,
    } as unknown as jest.Mocked<UserRepository>;

    mockUserPointRepository = {
      deleteByUserId: mockUPRDeleteByUId
    } as unknown as jest.Mocked<UserPointRepository>;

    deleteUserUseCase = new DeleteUserUseCase(mockUserRepository, mockUserPointRepository);
  });

  it('should delete user if found', async () => {
    mockURFindById.mockResolvedValue({ id: mockUserId, name: 'Rickyslash' });

    await deleteUserUseCase.execute(mockUserId);

    expect(mockURFindById).toHaveBeenCalledWith(mockUserId);
    expect(mockUPRDeleteByUId).toHaveBeenCalledWith(mockUserId);
    expect(mockURDelete).toHaveBeenCalledWith(mockUserId);
  });

  it('should throw NotFoundError if user not found', async () => {
    mockURFindById.mockResolvedValue(null);

    await expect(deleteUserUseCase.execute(mockUserId))
      .rejects.toThrow(NotFoundError);

    expect(mockUPRDeleteByUId).not.toHaveBeenCalled();
    expect(mockURDelete).not.toHaveBeenCalled();
  });
});
