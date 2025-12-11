import { NotFoundError } from '../../../../../commons/exceptions';
import GameRepository from '../../../../../domains/game/GameRepository';
import UserRepository from '../../../../../domains/user/UserRepository';
import GameTokenManager from '../../../../ports/security/GameTokenManager';
import UpdateGameUseCase from '../UpdateGameUseCase';
import { UpdateGameCmd } from '../commands/UpdateGameCmd';
import { UpdateGameDTO } from '../dto/UpdateGameDTO';

describe('UpdateGameUseCase', () => {
  let mockGameRepository: jest.Mocked<GameRepository>;
  let mockGameTokenManager: jest.Mocked<GameTokenManager>;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let updateGameUseCase: UpdateGameUseCase;

  let mockGRFindById: jest.Mock;
  let mockGRSave: jest.Mock;
  let mockURFindById: jest.Mock;
  let mockGTMVerifyToken: jest.Mock;
  let mockGTMVerifyPayload: jest.Mock;

  const mockGameId = 'game-123';
  const mockUserId = 'user-123';
  const mockGameToken = 'mock.game.token';

  const baseGameData = {
    id: mockGameId,
    nouns: [],
    userId: mockUserId,
    points: 30
  };

  const mockCmd: UpdateGameCmd = {
    id: mockGameId,
    gameToken: mockGameToken,
    payload: { userId: 'user-999' }
  };

  beforeEach(() => {
    mockGRFindById = jest.fn();
    mockGRSave = jest.fn();
    mockURFindById = jest.fn();
    mockGTMVerifyToken = jest.fn();
    mockGTMVerifyPayload = jest.fn();

    mockGameRepository = {
      findById: mockGRFindById,
      save: mockGRSave
    } as unknown as jest.Mocked<GameRepository>;

    mockGameTokenManager = {
      verifyGameToken: mockGTMVerifyToken,
      verifyPayload: mockGTMVerifyPayload,
    } as unknown as jest.Mocked<GameTokenManager>;

    mockUserRepository = {
      findById: mockURFindById,
    } as unknown as jest.Mocked<UserRepository>;

    updateGameUseCase = new UpdateGameUseCase(mockGameRepository, mockGameTokenManager, mockUserRepository);
  });

  it('should update game and return updated DTO when new user exists', async () => {
    mockGRFindById.mockResolvedValue(baseGameData);
    mockURFindById.mockResolvedValue({ id: mockCmd.payload.userId });

    const expectedUpdated: UpdateGameDTO = {
      id: baseGameData.id,
      userId: mockCmd.payload.userId,
      points: baseGameData.points,
      nouns: baseGameData.nouns.map(({ id, word, meanings }) => ({ id, word, meanings }))
    };

    const result = await updateGameUseCase.execute(mockCmd);

    expect(mockGRFindById).toHaveBeenCalledWith(mockGameId);
    expect(mockURFindById).toHaveBeenCalledWith(mockCmd.payload.userId);
    expect(mockGRSave).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedUpdated);
  });

  it('should throw NotFoundError when game not found', async () => {
    mockGRFindById.mockResolvedValue(null);

    await expect(updateGameUseCase.execute(mockCmd)).rejects.toThrow(NotFoundError);

    expect(mockGRFindById).toHaveBeenCalledWith(mockGameId);
    expect(mockGRSave).not.toHaveBeenCalled();
    expect(mockURFindById).not.toHaveBeenCalled();
  });

  it('should throw NotFoundError when new userId does not exist', async () => {
    mockGRFindById.mockResolvedValue(baseGameData);
    mockURFindById.mockResolvedValue(null);

    await expect(updateGameUseCase.execute(mockCmd)).rejects.toThrow(NotFoundError);

    expect(mockGRFindById).toHaveBeenCalledWith(mockGameId);
    expect(mockURFindById).toHaveBeenCalledWith(mockCmd.payload.userId);
    expect(mockGRSave).not.toHaveBeenCalled();
  });
});
