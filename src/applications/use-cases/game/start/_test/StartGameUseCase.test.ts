import NounsCollectionTestHelper from '../../../../../../tests/NounsCollectionTestHelper';
import { InvariantError } from '../../../../../commons/exceptions';
import GameRepository from '../../../../../domains/game/GameRepository';
import GameTokenManager from '../../../../ports/security/GameTokenManager';
import NounQueryRepository from '../../../../query-repositories/noun/NounQueryRepository';
import StartGameUseCase from '../StartGameUseCase';

describe('StartGameUseCase', () => {
  let mockNounRepository: NounQueryRepository;
  let mockGameRepository: GameRepository;
  let mockGameTokenManager: GameTokenManager;
  let startGameUseCase: StartGameUseCase;
  let mockNRGetRandom: jest.Mock;
  let mockGRSave: jest.Mock;
  let mockGTMGToken: jest.Mock;
  let mockGTMVPayload: jest.Mock;

  const mockNouns = Object.values(NounsCollectionTestHelper.getNouns());
  const validToken = 'valid-token';

  beforeEach(() => {
    mockNRGetRandom = jest.fn().mockResolvedValue(mockNouns);
    mockGRSave = jest.fn().mockResolvedValue(undefined);
    mockGTMGToken = jest.fn();
    mockGTMVPayload = jest.fn();

    mockNounRepository = {
      getRandom: mockNRGetRandom,
    } as Partial<NounQueryRepository> as NounQueryRepository;

    mockGameRepository = {
      save: mockGRSave,
    } as Partial<GameRepository> as GameRepository;

    mockGameTokenManager = {
      verifyGameToken: mockGTMGToken,
      verifyPayload: mockGTMVPayload,
    } as Partial<GameTokenManager> as GameTokenManager;

    startGameUseCase = new StartGameUseCase(mockGameRepository, mockGameTokenManager, mockNounRepository);
  });

  it('should create a game and return StartGameDTO', async () => {
    const userId = 'user-123';
    const result = await startGameUseCase.execute(validToken, userId);

    expect(mockGTMGToken).toHaveBeenCalledWith(validToken);
    expect(mockGTMVPayload).toHaveBeenCalledWith(validToken);

    expect(result.nouns).toEqual(
      mockNouns.map(({ id, word, meanings }) => ({ id, word, meanings }))
    );

    expect(mockGRSave).toHaveBeenCalledTimes(1);
    expect(mockGRSave).toHaveBeenCalledWith(
      expect.objectContaining({
        userId,
        nouns: mockNouns.map(n => ({ id: n.id, gender: n.gender, word: n.word, meanings: n.meanings }))
      })
    );
  });

  it('should throw if token verification fails', async () => {
    mockGameTokenManager.verifyGameToken = jest.fn(() => { throw new InvariantError('Invalid token'); });
    await expect(startGameUseCase.execute(validToken)).rejects.toThrow(InvariantError);
  });

  it('should throw if payload verification fails', async () => {
    mockGameTokenManager.verifyPayload = jest.fn(() => { throw new InvariantError('Invalid payload'); });
    await expect(startGameUseCase.execute(validToken)).rejects.toThrow(InvariantError);
  });
});
