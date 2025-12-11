import NounsCollectionTestHelper from '../../../../../../tests/NounsCollectionTestHelper';
import { InvariantError } from '../../../../../commons/exceptions';
import { NotFoundError } from '../../../../../commons/exceptions/client/NotFoundError';
import Game from '../../../../../domains/game/entities/Game';
import GameRepository from '../../../../../domains/game/GameRepository';
import Noun, { Gender } from '../../../../../domains/noun/entities/Noun';
import { USER_POINT_CONSTANTS } from '../../../../../domains/userPoint/constants/userPointConstants';
import GameTokenManager from '../../../../ports/security/GameTokenManager';
import NounQueryRepository from '../../../../query-repositories/noun/NounQueryRepository';
import { SubmitAnswerCmd } from '../command/SubmitAnswerCmd';
import SubmitAnswerUseCase from '../SubmitAnswerUseCase';

describe('SubmitAnswerUseCase', () => {
  const mockGameToken = 'mock.game.token';

  let mockGameRepository: GameRepository;
  let mockGameTokenManager: GameTokenManager;
  let mockNounQueryRepository: NounQueryRepository;
  let submitAnswerUseCase: SubmitAnswerUseCase;
  let mockGame: Game;
  let mockGRSaveMethod: jest.Mock;
  let mockNQRGRandom: jest.Mock;
  let mockGTMGToken: jest.Mock;
  let mockGTMVPayload: jest.Mock;

  beforeEach(() => {
    const nouns = Object.values(NounsCollectionTestHelper.getNouns())
      .map(({ id, word, gender, meanings }) => ({ id, word, gender, meanings }));

    const randomNouns = Object.values(NounsCollectionTestHelper.getNouns());

    mockGame = new Game({
      id: 'game-123',
      userId: 'user-123',
      nouns,
    });

    mockGRSaveMethod = jest.fn().mockResolvedValue(undefined);
    mockNQRGRandom = jest.fn().mockResolvedValue(randomNouns);
    mockGTMGToken = jest.fn();
    mockGTMVPayload = jest.fn();

    mockGameRepository = {
      findById: jest.fn().mockResolvedValue(mockGame),
      save: mockGRSaveMethod,
      delete: jest.fn(),
    } as Partial<GameRepository> as GameRepository;

    mockNounQueryRepository = {
      getRandom: mockNQRGRandom
    } as Partial<NounQueryRepository> as NounQueryRepository;

    mockGameTokenManager = {
      verifyGameToken: mockGTMGToken,
      verifyPayload: mockGTMVPayload,
    } as Partial<GameTokenManager> as GameTokenManager;

    submitAnswerUseCase = new SubmitAnswerUseCase(mockGameRepository, mockGameTokenManager, mockNounQueryRepository);
  });

  it('should mark answer correct, increment points, remove noun, and save game', async () => {
    const targetNoun = mockGame.nouns[0];

    const cmd: SubmitAnswerCmd = {
      gameId: mockGame.id,
      nounId: targetNoun.id,
      answer: targetNoun.gender,
      gameToken: mockGameToken
    };

    const result = await submitAnswerUseCase.execute(cmd);

    expect(result.correct).toBe(true);
    expect(result.currentScore).toBe(USER_POINT_CONSTANTS.INCREMENT_POINT);
    expect(result.nouns).toBeUndefined();
    expect(mockGame.nouns.find(n => n.id === targetNoun.id)).toBeUndefined();
    expect(mockGRSaveMethod).toHaveBeenCalled();
  });

  it('should mark answer incorrect, decrement points, remove noun, and save game', async () => {
    mockGame.points = USER_POINT_CONSTANTS.DECREMENT_POINT + 5;
    
    const initialPoints = mockGame.points;
    const targetNoun = mockGame.nouns[0];

    const cmd: SubmitAnswerCmd = {
      gameId: mockGame.id,
      nounId: targetNoun.id,
      answer: 'neuter' as Gender,
      gameToken: mockGameToken
    };

    const result = await submitAnswerUseCase.execute(cmd);

    expect(result.correct).toBe(false);
    expect(result.currentScore).toBe(initialPoints - USER_POINT_CONSTANTS.DECREMENT_POINT);
    expect(result.nouns).toBeUndefined();
    expect(mockGame.nouns.find(n => n.id === targetNoun.id)).toBeUndefined();
    expect(mockGRSaveMethod).toHaveBeenCalled();
  });

  it('should floor points to zero when decrement would go negative', async () => {
    mockGame.points = USER_POINT_CONSTANTS.DECREMENT_POINT - 100;
    
    const targetNoun = mockGame.nouns[0];

    const cmd: SubmitAnswerCmd = {
      gameId: mockGame.id,
      nounId: targetNoun.id,
      answer: 'neuter' as Gender,
      gameToken: mockGameToken
    };

    const result = await submitAnswerUseCase.execute(cmd);

    expect(result.currentScore).toBe(0);
  });

  it('should throw NotFoundError if game does not exist', async () => {
    (mockGameRepository.findById as jest.Mock).mockResolvedValueOnce(null);

    const cmd: SubmitAnswerCmd = {
      gameId: 'nonexistent',
      nounId: 'noun-123',
      answer: 'masculine',
      gameToken: mockGameToken
    };

    await expect(submitAnswerUseCase.execute(cmd)).rejects.toThrow(NotFoundError);
  });

  it('should throw InvariantError if noun not in game', async () => {
    const cmd: SubmitAnswerCmd = {
      gameId: mockGame.id,
      nounId: 'nonexistent-id',
      answer: 'masculine',
      gameToken: mockGameToken
    };

    await expect(submitAnswerUseCase.execute(cmd)).rejects.toThrow(InvariantError);
  });

  it('should return new nouns when all game nouns are answered', async () => {
    const singleNounGame = new Game({
      id: 'game-789',
      userId: 'user-123',
      nouns: [{ id: 'noun-123', word: 'Hund', gender: 'masculine', meanings: ['dog'] }],
    });

    (mockGameRepository.findById as jest.Mock).mockResolvedValueOnce(singleNounGame);

    const cmd: SubmitAnswerCmd = {
      gameId: singleNounGame.id,
      nounId: 'noun-123',
      answer: 'masculine',
      gameToken: mockGameToken
    };

    const result = await submitAnswerUseCase.execute(cmd);

    expect(result.nouns).toBeDefined();
    expect(Array.isArray(result.nouns)).toBe(true);
    expect(result.nouns!.length).toBeGreaterThan(0);
    expect(mockNQRGRandom).toHaveBeenCalled();

    const expectedNounIds = Object.values(NounsCollectionTestHelper.getNouns())
      .map(n => n.id);

    expect(mockGRSaveMethod).toHaveBeenCalledWith(
      expect.objectContaining({
        nouns: expect.arrayContaining(
          expectedNounIds.map(id => expect.objectContaining({ id }) as string[])
        ) as Noun[],
      } as Partial<Game>)
    );
  });

  it('should call verifyGameToken and verifyPayload', async () => {
    const targetNoun = mockGame.nouns[0];

    const cmd: SubmitAnswerCmd = {
      gameId: mockGame.id,
      nounId: targetNoun.id,
      answer: targetNoun.gender,
      gameToken: mockGameToken,
    };

    await submitAnswerUseCase.execute(cmd);

    expect(mockGTMGToken).toHaveBeenCalledWith(mockGameToken);
    expect(mockGTMVPayload).toHaveBeenCalledWith(mockGameToken);
  });
});
