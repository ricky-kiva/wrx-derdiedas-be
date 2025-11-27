import NounsCollectionTestHelper from '../../../../../../tests/NounsCollectionTestHelper';
import GameRepository from '../../../../../domains/game/GameRepository';
import NounQueryRepository from '../../../../query-repositories/noun/NounQueryRepository';
import StartGameUseCase from '../StartGameUseCase';

describe('StartGameUseCase', () => {
  it('should create a game and return StartGameDTO', async () => {
    const mockNouns = Object.values(NounsCollectionTestHelper.getNouns());

    const nounRepoMock: NounQueryRepository = {
      getRandom: jest.fn().mockResolvedValue(mockNouns),
    } as Partial<NounQueryRepository> as NounQueryRepository;

    const saveMethodMock = jest.fn().mockResolvedValue(undefined);

    const gameRepoMock: GameRepository = {
      save: saveMethodMock,
      findById: jest.fn(),
      delete: jest.fn(),
    } as Partial<GameRepository> as GameRepository;

    const useCase = new StartGameUseCase(gameRepoMock, nounRepoMock);

    const userId = 'user-123';
    const result = await useCase.execute(userId);

    expect(result.nouns).toEqual(mockNouns.map(({ id, word, meanings }) => ({ id, word, meanings })));

    expect(saveMethodMock).toHaveBeenCalledTimes(1);
    expect(saveMethodMock).toHaveBeenCalledWith(
      expect.objectContaining({
        userId,
        nouns: mockNouns
          .map(n => ({ id: n.id, gender: n.gender, word: n.word, meanings: n.meanings }))
      })
    );
  });
});
