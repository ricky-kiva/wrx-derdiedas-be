import { NotFoundError } from '../../../../../commons/exceptions';
import UserRepository from '../../../../../domains/user/UserRepository';
import { UserPointQueryRepository } from '../../../../query-repositories/user-point/UserPointQueryRepository';
import GetUserPointUseCase from '../GetUserPointUseCase';

describe('GetUserPointUseCase', () => {
  const mockUserId = 'user-123';
  const mockPoints = 150;

  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockUserPointQueryRepository: jest.Mocked<UserPointQueryRepository>;
  let getUserPointUseCase: GetUserPointUseCase;
  let mockURFindbyId: jest.Mock;
  let mockUPRFindbyUserId: jest.Mock;

  beforeEach(() => {
    mockURFindbyId = jest.fn();
    mockUPRFindbyUserId = jest.fn();

    mockUserRepository = {
      findById: mockURFindbyId,
    } as unknown as jest.Mocked<UserRepository>;

    mockUserPointQueryRepository = {
      findByUserId: mockUPRFindbyUserId
    } as unknown as jest.Mocked<UserPointQueryRepository>;

    getUserPointUseCase = new GetUserPointUseCase(
      mockUserPointQueryRepository,
      mockUserRepository
    );
  });

  it('should return user point if User and Point exist', async () => {
    mockUserRepository.findById.mockResolvedValue({ id: mockUserId, name: 'Rickyslash' });
    mockUserPointQueryRepository.findByUserId.mockResolvedValue({
      userId: mockUserId,
      point: mockPoints,
      updatedAt: new Date(),
    });

    const result = await getUserPointUseCase.execute(mockUserId);

    expect(result).toBe(mockPoints);
    expect(mockURFindbyId).toHaveBeenCalledWith(mockUserId);
    expect(mockUPRFindbyUserId).toHaveBeenCalledWith(mockUserId);
  });

  it('should throw NotFoundError if User not found', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(getUserPointUseCase.execute(mockUserId))
      .rejects.toThrow(NotFoundError);
  });

  it('should throw NotFoundError if User Point not found', async () => {
    mockUserRepository.findById.mockResolvedValue({ id: mockUserId, name: 'Rickyslash' });
    mockUserPointQueryRepository.findByUserId.mockResolvedValue(null);

    await expect(getUserPointUseCase.execute(mockUserId))
      .rejects.toThrow(NotFoundError);
  });
});
