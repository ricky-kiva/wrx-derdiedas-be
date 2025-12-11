import { NotFoundError } from '../../../../../commons/exceptions';
import GameRepository from '../../../../../domains/game/GameRepository';
import GameTokenManager from '../../../../ports/security/GameTokenManager';
import DeleteGameUseCase from '../DeleteGameUseCase';

describe('DeleteGameUseCase', () => {
  const mockGameId = 'game-123';
  const mockGameToken = 'mock.game.token';

  let mockGameRepository: jest.Mocked<GameRepository>;
  let mockGameTokenManager: jest.Mocked<GameTokenManager>;
  let deleteGameUseCase: DeleteGameUseCase;
  let mockGRFindById: jest.Mock;
  let mockGRDelete: jest.Mock;
  let mockGTMVerifyToken: jest.Mock;
  let mockGTMVerifyPayload: jest.Mock;

  beforeEach(() => {
    mockGRFindById = jest.fn();
    mockGRDelete = jest.fn();
    mockGTMVerifyToken = jest.fn();
    mockGTMVerifyPayload = jest.fn();

    mockGameRepository = {
      findById: mockGRFindById,
      delete: mockGRDelete
    } as unknown as jest.Mocked<GameRepository>;

    mockGameTokenManager = {
      verifyGameToken: mockGTMVerifyToken,
      verifyPayload: mockGTMVerifyPayload,
    } as unknown as jest.Mocked<GameTokenManager>;

    deleteGameUseCase = new DeleteGameUseCase(mockGameRepository, mockGameTokenManager);
  });

  it('should delete the game when it exists', async () => {
    mockGRFindById.mockResolvedValue({ id: mockGameId });

    await deleteGameUseCase.execute(mockGameToken, mockGameId);

    expect(mockGTMVerifyToken).toHaveBeenCalledWith(mockGameToken);
    expect(mockGTMVerifyPayload).toHaveBeenCalledWith(mockGameToken);
    expect(mockGRFindById).toHaveBeenCalledWith(mockGameId);
    expect(mockGRDelete).toHaveBeenCalledWith(mockGameId);
  });

  it('should throw NotFoundError when game does not exist', async () => {
    mockGRFindById.mockResolvedValue(null);

    await expect(deleteGameUseCase.execute(mockGameToken, mockGameId))
      .rejects
      .toBeInstanceOf(NotFoundError);

    expect(mockGTMVerifyToken).toHaveBeenCalledWith(mockGameToken);
    expect(mockGTMVerifyPayload).toHaveBeenCalledWith(mockGameToken);
    expect(mockGRFindById).toHaveBeenCalledWith(mockGameId);
    expect(mockGRDelete).not.toHaveBeenCalled();
  });
});
