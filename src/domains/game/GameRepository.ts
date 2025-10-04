import NounsCollectionTestHelper from '../../../tests/NounsCollectionTestHelper';
import Game from './entities/Game';

describe('Game', () => {
  it('should create a Game object correctly', () => {
    const words = NounsCollectionTestHelper.getNouns();

    const gamePayload = {
      id: 'game-123',
      userId: 'user-456',
      words: words.map(({ id, word, gender }) => ({ id, word, gender })),
    };

    const game = new Game(gamePayload);

    expect(game.id).toBe('game-123');
    expect(game.userId).toBe('user-456');
    expect(game.words).toHaveLength(words.length);
    expect(game.words[0]).toEqual(words[0]);
  });

  it('should allow creating a game without userId (anonymous)', () => {
    const words = NounsCollectionTestHelper.getNouns();

    const game = new Game({
      id: 'user-123',
      words: words.map(({ id, word, gender }) => ({ id, word, gender })),
    });

    expect(game.userId).toBeUndefined();
    expect(game.words[0].word).toBe(words[0].word);
  });
});
