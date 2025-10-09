import User from '../../../../../domains/user/entities/User';
import UserRepository from '../../../../../domains/user/UserRepository';
import { USER_POINT_CONSTANTS } from '../../../../../domains/userPoint/constants/userPointConstancts';
import UserPoint from '../../../../../domains/userPoint/entities/UserPoint';
import UserPointRepository from '../../../../../domains/userPoint/UserPointRepository';
import { UserPointQueryRepository } from '../../../../query-repositories/user-point/UserPointQueryRepository';
import DecayPointsUseCase from '../DecayPointsUseCase';

describe('DecayPointsUseCase', () => {
  let mockUserPointQueryRepository: jest.Mocked<UserPointQueryRepository>;
  let mockUserPointRepository: jest.Mocked<UserPointRepository>;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let decayPointsUseCase: DecayPointsUseCase;
  let mockUPRDecrement: jest.Mock;
  let mockUPRDeleteByUserId: jest.Mock;
  let mockURDelete: jest.Mock;

  beforeEach(() => {
    mockUserPointQueryRepository = {
      findAll: jest.fn(),
    } as unknown as jest.Mocked<UserPointQueryRepository>;

    mockUPRDecrement = jest.fn();
    mockUPRDeleteByUserId = jest.fn();

    mockUserPointRepository = {
      decrement: mockUPRDecrement,
      deleteByUserId: mockUPRDeleteByUserId,
    } as unknown as jest.Mocked<UserPointRepository>;

    mockURDelete = jest.fn();

    mockUserRepository = {
      findById: jest.fn(),
      delete: mockURDelete,
    } as unknown as jest.Mocked<UserRepository>;

    decayPointsUseCase = new DecayPointsUseCase(
      mockUserPointQueryRepository,
      mockUserPointRepository,
      mockUserRepository
    );
  });

  it('should decrement user points by default amount if updatedAt <= threshold and point > DECREMENT_POINT', async () => {
    const thresholdDate = new Date();

    thresholdDate.setDate(thresholdDate.getDate() - 8);

    const userId = 'user-123';

    const mockUserPoints = [
      new UserPoint({
        userId,
        point: USER_POINT_CONSTANTS.DECREMENT_POINT + 5,
        updatedAt: thresholdDate,
      }),
    ];

    mockUserPointQueryRepository.findAll.mockResolvedValue(mockUserPoints);

    await decayPointsUseCase.execute();

    expect(mockUPRDecrement).toHaveBeenCalledWith(userId,USER_POINT_CONSTANTS.DECREMENT_POINT);
  });

  it('should delete user and userPoint if point <= DECREMENT_POINT and user not logged in', async () => {
    const thresholdDate = new Date();

    thresholdDate.setDate(thresholdDate.getDate() - 8);

    const userId = 'user-456';

    const mockUserPoints = [
      new UserPoint({
        userId,
        point: USER_POINT_CONSTANTS.DECREMENT_POINT,
        updatedAt: thresholdDate,
      }),
    ];

    const guestUser = new User({
      id: userId,
      email: '',
      name: 'Rezy',
    });

    mockUserPointQueryRepository.findAll.mockResolvedValue(mockUserPoints);
    mockUserRepository.findById.mockResolvedValue(guestUser);

    await decayPointsUseCase.execute();

    expect(mockURDelete).toHaveBeenCalledWith(userId);
    expect(mockUPRDeleteByUserId).toHaveBeenCalledWith(userId);
  });

  it('should decrement all remaining points if user exists but logged in', async () => {
    const thresholdDate = new Date();

    thresholdDate.setDate(thresholdDate.getDate() - 8);

    const userId = 'user-789';

    const mockUserPoints = [
      new UserPoint({
        userId,
        point: USER_POINT_CONSTANTS.DECREMENT_POINT,
        updatedAt: thresholdDate,
      }),
    ];

    const loggedInUser = new User({
      id: userId,
      email: 'test@example.com',
      name: 'Rickyslash',
    });

    mockUserPointQueryRepository.findAll.mockResolvedValue(mockUserPoints);
    mockUserRepository.findById.mockResolvedValue(loggedInUser);

    await decayPointsUseCase.execute();

    expect(mockUPRDecrement).toHaveBeenCalledWith(userId, USER_POINT_CONSTANTS.DECREMENT_POINT);
    expect(mockURDelete).not.toHaveBeenCalled();
  });

  it('should not decrement or delete if user updated within 7 days', async () => {
    const thresholdDate = new Date();

    thresholdDate.setDate(thresholdDate.getDate() - 6);

    const userPoint = {
      userId: 'user-890',
      point: USER_POINT_CONSTANTS.INCREMENT_POINT,
      updatedAt: thresholdDate,
    };

    mockUserPointQueryRepository.findAll.mockResolvedValue([userPoint]);

    await decayPointsUseCase.execute();

    expect(mockUPRDecrement).not.toHaveBeenCalled();
    expect(mockURDelete).not.toHaveBeenCalled();
  });
});
