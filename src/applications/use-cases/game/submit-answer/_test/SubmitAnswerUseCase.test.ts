import NounsCollectionTestHelper from '../../../../../../tests/NounsCollectionTestHelper';
import { InvariantError } from '../../../../../commons/exceptions';
import { NotFoundError } from '../../../../../commons/exceptions/client/NotFoundError';
import Game from '../../../../../domains/game/entities/Game';
import GameRepository from '../../../../../domains/game/GameRepository';
import { Gender } from '../../../../../domains/noun/entities/Noun';
import { SubmitAnswerCmd } from '../command/SubmitAnswerCmd';
import SubmitAnswerUseCase from '../SubmitAnswerUseCase';

describe('SubmitAnswerUseCase', () => {
  const INCREMENT_POINTS = 10;

  let mockGameRepository: GameRepository;
  let submitAnswerUseCase: SubmitAnswerUseCase;
  let mockGame: Game;
  let mockGRSaveMethod: jest.Mock;

  beforeEach(() => {
    const nouns = Object.values(NounsCollectionTestHelper.getNouns())
      .map(({ id, word, gender }) => ({ id, word, gender }));

    mockGame = new Game({
      id: 'game-123',
      userId: 'user-123',
      nouns,
    });

    mockGRSaveMethod = jest.fn().mockResolvedValue(undefined);

    mockGameRepository = {
      findById: jest.fn().mockResolvedValue(mockGame),
      save: mockGRSaveMethod,
      delete: jest.fn(),
    } as Partial<GameRepository> as GameRepository;

    submitAnswerUseCase = new SubmitAnswerUseCase(mockGameRepository);
  });

  it('should mark answer correct, increment points, remove noun, and save game', async () => {
    const targetNoun = mockGame.nouns[0];

    const cmd: SubmitAnswerCmd = {
      gameId: mockGame.id,
      nounId: targetNoun.id,
      answer: targetNoun.gender,
    };

    const result = await submitAnswerUseCase.execute(cmd);

    expect(result.correct).toBe(true);
    expect(result.currentScore).toBe(INCREMENT_POINTS);
    expect(mockGame.nouns.find(n => n.id === targetNoun.id)).toBeUndefined();
    expect(mockGRSaveMethod).toHaveBeenCalledWith(mockGame);
  });

  it('should mark answer incorrect, not increment points, remove noun, and save game', async () => {
    const targetNoun = mockGame.nouns[0];

    const cmd: SubmitAnswerCmd = {
      gameId: mockGame.id,
      nounId: targetNoun.id,
      answer: 'neuter' as Gender,
    };

    const result = await submitAnswerUseCase.execute(cmd);

    expect(result.correct).toBe(false);
    expect(result.currentScore).toBe(0);
    expect(mockGame.nouns.find(n => n.id === targetNoun.id)).toBeUndefined();
    expect(mockGRSaveMethod).toHaveBeenCalledWith(mockGame);
  });

  it('should throw NotFoundError if game does not exist', async () => {
    (mockGameRepository.findById as jest.Mock).mockResolvedValueOnce(null);

    const cmd: SubmitAnswerCmd = {
      gameId: 'nonexistent',
      nounId: 'noun-123',
      answer: 'masculine',
    };

    await expect(submitAnswerUseCase.execute(cmd)).rejects.toThrow(NotFoundError);
  });

  it('should throw InvariantError if noun not in game', async () => {
    const cmd: SubmitAnswerCmd = {
      gameId: mockGame.id,
      nounId: 'nonexistent-id',
      answer: 'masculine',
    };

    await expect(submitAnswerUseCase.execute(cmd)).rejects.toThrow(InvariantError);
  });
});
