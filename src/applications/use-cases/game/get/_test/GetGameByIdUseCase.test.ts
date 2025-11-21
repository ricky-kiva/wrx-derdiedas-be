import { NotFoundError } from '../../../../../commons/exceptions';
import GameRepository from '../../../../../domains/game/GameRepository';
import GetGameByIdUseCase from '../GetGameByIdUseCase';
import { GetGameByIdDTO } from '../dto/GetGameByIdDTO';

describe('GetGameByIdUseCase', () => {
  const mockGameId = 'game-123';
  const mockUserId = 'user-123';

  let mockGameRepository: jest.Mocked<GameRepository>;
  let getGameByIdUseCase: GetGameByIdUseCase;
  let mockFindById: jest.Mock;

  beforeEach(() => {
    mockFindById = jest.fn();

    mockGameRepository = {
      findById: mockFindById,
    } as unknown as jest.Mocked<GameRepository>;

    getGameByIdUseCase = new GetGameByIdUseCase(mockGameRepository);
  });

  it('should return game DTO when game exists', async () => {
    const mockGame: GetGameByIdDTO = {
      id: mockGameId,
      nouns: [],
      userId: mockUserId,
      points: 100
    };

    mockFindById.mockResolvedValue(mockGame);

    const result = await getGameByIdUseCase.execute(mockGameId);

    expect(mockFindById).toHaveBeenCalledWith(mockGameId);
    expect(result).toEqual(mockGame);
  });

  it('should return null when game does not exist', async () => {
    mockFindById.mockResolvedValue(null);

    await expect(getGameByIdUseCase.execute(mockGameId))
      .rejects
      .toBeInstanceOf(NotFoundError);

    expect(mockFindById).toHaveBeenCalledWith(mockGameId);
  });
});
