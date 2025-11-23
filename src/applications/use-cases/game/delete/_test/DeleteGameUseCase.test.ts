import { NotFoundError } from '../../../../../commons/exceptions';
import GameRepository from '../../../../../domains/game/GameRepository';
import DeleteGameUseCase from '../DeleteGameUseCase';

describe('DeleteGameUseCase', () => {
  const mockGameId = 'game-123';

  let mockGameRepository: jest.Mocked<GameRepository>;
  let deleteGameUseCase: DeleteGameUseCase;
  let mockGRFindById: jest.Mock;
  let mockGRDelete: jest.Mock;

  beforeEach(() => {
    mockGRFindById = jest.fn();
    mockGRDelete = jest.fn();

    mockGameRepository = {
      findById: mockGRFindById,
      delete: mockGRDelete
    } as unknown as jest.Mocked<GameRepository>;

    deleteGameUseCase = new DeleteGameUseCase(mockGameRepository);
  });

  it('should delete the game when it exists', async () => {
    mockGRFindById.mockResolvedValue({ id: mockGameId });

    await deleteGameUseCase.execute(mockGameId);

    expect(mockGRFindById).toHaveBeenCalledWith(mockGameId);
    expect(mockGRDelete).toHaveBeenCalledWith(mockGameId);
  });

  it('should throw NotFoundError when game does not exist', async () => {
    mockGRFindById.mockResolvedValue(null);

    await expect(deleteGameUseCase.execute(mockGameId))
      .rejects
      .toBeInstanceOf(NotFoundError);

    expect(mockGRFindById).toHaveBeenCalledWith(mockGameId);
    expect(mockGRDelete).not.toHaveBeenCalled();
  });
});
