import { InvariantError, NotFoundError } from '../../../../../commons/exceptions';
import Game from '../../../../../domains/game/entities/Game';
import GameRepository from '../../../../../domains/game/GameRepository';
import UserRepository from '../../../../../domains/user/UserRepository';
import UserPointRepository from '../../../../../domains/userPoint/UserPointRepository';
import EndGameUseCase from '../EndGameUseCase';

describe('EndGameUseCase', () => {
  const mockGameId = 'game-123';
  const mockUserId = 'user-123';
  const mockPoints = 100;

  let mockGameRepository: jest.Mocked<GameRepository>;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockUserPointRepository: jest.Mocked<UserPointRepository>;
  let endGameUseCase: EndGameUseCase;
  let mockGRDelete: jest.Mock;
  let mockUPRIncrement: jest.Mock;
  let mockURCreate: jest.Mock;
  let mockUPRSave: jest.Mock;

  beforeEach(() => {
    mockGRDelete = jest.fn();
    mockUPRIncrement = jest.fn();
    mockURCreate = jest.fn();
    mockUPRSave = jest.fn();

    mockGameRepository = {
      findById: jest.fn(),
      delete: mockGRDelete,
    } as unknown as jest.Mocked<GameRepository>;

    mockUserRepository = {
      findById: jest.fn(),
      create: mockURCreate,
    } as unknown as jest.Mocked<UserRepository>;

    mockUserPointRepository = {
      increment: mockUPRIncrement,
      save: mockUPRSave,
    } as unknown as jest.Mocked<UserPointRepository>;

    endGameUseCase = new EndGameUseCase(mockGameRepository, mockUserPointRepository, mockUserRepository);
  });

  it('should increment points for existing logged-in user', async () => {
    const game = new Game({ id: mockGameId, userId: mockUserId, points: mockPoints, nouns: [] });

    mockGameRepository.findById.mockResolvedValue(game);
    mockUserRepository.findById.mockResolvedValue({ id: mockUserId, name: 'Rickyslash' });

    const result = await endGameUseCase.execute({ gameId: mockGameId });

    expect(result).toBe(mockUserId);
    expect(mockGRDelete).toHaveBeenCalled();
    expect(mockUPRIncrement).toHaveBeenCalledWith(mockUserId, mockPoints);
  });

  it('should create new anonymous user and save points', async () => {
    const game = new Game({ id: mockGameId, points: mockPoints, nouns: [] });

    const userName = 'Rezy';

    mockGameRepository.findById.mockResolvedValue(game);
    mockUserRepository.create.mockResolvedValue({ id: mockUserId, name: userName });

    const result = await endGameUseCase.execute({ gameId: mockGameId, name: userName });

    expect(result).toBe(mockUserId);
    expect(mockURCreate).toHaveBeenCalledWith({ name: userName });
    expect(mockUPRSave).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: mockUserId,
        point: mockPoints,
      })
    );
  });

  it('should delete game and return null when guest has 0 points', async () => {
    const zeroPointGame = new Game({ id: mockGameId, points: 0, nouns: [] });

    mockGameRepository.findById.mockResolvedValue(zeroPointGame);

    const result = await endGameUseCase.execute({ gameId: mockGameId, name: 'Rezy' });

    expect(result).toBeNull();
    expect(mockGRDelete).toHaveBeenCalledWith(mockGameId);
    expect(mockURCreate).not.toHaveBeenCalled();
    expect(mockUPRSave).not.toHaveBeenCalled();
  });

  it('should throw NotFoundError if game not found', async () => {
    mockGameRepository.findById.mockResolvedValue(null);
    await expect(endGameUseCase.execute({ gameId: mockGameId })).rejects.toThrow(NotFoundError);
  });

  it('should throw NotFoundError if user not found', async () => {
    const game = new Game({ id: mockGameId, userId: mockUserId, points: mockPoints, nouns: [] });

    mockGameRepository.findById.mockResolvedValue(game);
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(endGameUseCase.execute({ gameId: mockGameId })).rejects.toThrow(NotFoundError);
  });

  it('should throw InvariantError if anonymous name not provided', async () => {
    const game = new Game({ id: mockGameId, points: mockPoints, nouns: [] });

    mockGameRepository.findById.mockResolvedValue(game);

    await expect(endGameUseCase.execute({ gameId: mockGameId }))
      .rejects.toThrow(InvariantError);
  });
});
