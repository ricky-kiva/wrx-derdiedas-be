import 'reflect-metadata';

import Game from '../../../../../../domains/game/entities/Game';
import GameRepository from '../../../../../../domains/game/GameRepository';
import UserPointRepository from '../../../../../../domains/userPoint/UserPointRepository';
import GameExpirationListener from '../GameExpirationListener';
import Redis from 'ioredis';

jest.mock('ioredis');

describe('GameExpirationListener', () => {
  let redisMock: jest.Mocked<Redis>;
  let subMock: jest.Mocked<Redis>;
  let gameRepository: jest.Mocked<GameRepository>;
  let userPointRepository: jest.Mocked<UserPointRepository>;
  let mockGRFindbyId: jest.Mock;
  let mockUPRIncrement: jest.Mock;
  let listener: GameExpirationListener;

  beforeEach(() => {
    redisMock = new Redis() as unknown as jest.Mocked<Redis>;
    subMock = new Redis() as unknown as jest.Mocked<Redis>;

    (Redis as unknown as jest.Mock).mockImplementationOnce(() => subMock);

    mockGRFindbyId = jest.fn();
    mockUPRIncrement = jest.fn();

    gameRepository = {
      findById: mockGRFindbyId,
    } as unknown as jest.Mocked<GameRepository>;

    userPointRepository = {
      increment: mockUPRIncrement,
    } as unknown as jest.Mocked<UserPointRepository>;

    listener = new GameExpirationListener(
      redisMock,
      userPointRepository,
      gameRepository
    );

    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should handle expired game key and increment user points', async () => {
    await listener.start();

    type MessageHandler = Parameters<Redis['on']>[1];

    const handler = (subMock.on as unknown as jest.MockedFunction<(
      event: string,
      handler: MessageHandler
    ) => void>).mock.calls[0][1];
    
    const mockGame = new Game({ 
      id: 'game-123', 
      userId: 'user-123', 
      points: 50, 
      nouns: []
    });

    gameRepository.findById.mockResolvedValueOnce(mockGame);

    handler('message', `game:${mockGame.id}`);
    
    await Promise.resolve();

    expect(mockGRFindbyId).toHaveBeenCalledWith(mockGame.id);
    expect(mockUPRIncrement).toHaveBeenCalledWith(mockGame.userId, mockGame.points);
  });

  it('should ignore non-game keys', async () => {
    await listener.start();

    type MessageHandler = Parameters<Redis['on']>[1];
    
    const handler = (subMock.on as unknown as jest.MockedFunction<(
      event: string,
      handler: MessageHandler
    ) => void>).mock.calls[0][1];

    handler('message', 'session:1234');

    await Promise.resolve();

    expect(mockGRFindbyId).not.toHaveBeenCalled();
    expect(mockUPRIncrement).not.toHaveBeenCalled();
  });
});
