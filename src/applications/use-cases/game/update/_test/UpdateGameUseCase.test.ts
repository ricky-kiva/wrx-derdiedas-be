import { NotFoundError } from '../../../../../commons/exceptions';
import GameRepository from '../../../../../domains/game/GameRepository';
import UpdateGameUseCase from '../UpdateGameUseCase';
import { UpdateGameCmd } from '../commands/UpdateGameCmd';
import Game from '../../../../../domains/game/entities/Game';

describe('UpdateGameUseCase', () => {
  let mockGameRepository: jest.Mocked<GameRepository>;
  let updateGameUseCase: UpdateGameUseCase;
  let mockFindById: jest.Mock;
  let mockSave: jest.Mock;

  const mockGameId = 'game-123';
  const mockUserId = 'user-123';

  const baseGameData = {
    id: mockGameId,
    nouns: [],
    userId: mockUserId,
    points: 30
  };

  const mockCmd: UpdateGameCmd = {
    id: mockGameId,
    payload: { userId: 'user-999' }
  };

  beforeEach(() => {
    mockFindById = jest.fn();
    mockSave = jest.fn();

    mockGameRepository = {
      findById: mockFindById,
      save: mockSave
    } as unknown as jest.Mocked<GameRepository>;

    updateGameUseCase = new UpdateGameUseCase(mockGameRepository);
  });

  it('should update game and return updated game DTO', async () => {
    mockFindById.mockResolvedValue(baseGameData);

    const expectedUpdated = new Game({
      ...baseGameData,
      ...mockCmd.payload
    });

    const result = await updateGameUseCase.execute(mockCmd);

    expect(mockFindById).toHaveBeenCalledWith(mockGameId);
    expect(mockSave).toHaveBeenCalledTimes(1);
    expect(result).toEqual(expectedUpdated);
  });

  it('should throw NotFoundError when game not found', async () => {
    mockFindById.mockResolvedValue(null);

    await expect(updateGameUseCase.execute(mockCmd)).rejects.toThrow(NotFoundError);

    expect(mockFindById).toHaveBeenCalledWith(mockGameId);
    expect(mockSave).not.toHaveBeenCalled();
  });
});
