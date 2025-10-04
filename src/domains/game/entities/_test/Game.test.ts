import NounsCollectionTestHelper from '../../../../../tests/NounsCollectionTestHelper';
import Noun from '../../../noun/entities/Noun';
import Game, { GamePayload } from '../Game';

describe('Game', () => {
  it('should create a Game object correctly', () => {
    const wordsObj = NounsCollectionTestHelper.getNouns();
    const words = Object.values(wordsObj);

    const game = new Game({
      id: 'game-123',
      userId: 'user-456',
      words: words.map(({ id, word, gender }) => ({ id, word, gender })),
    } satisfies GamePayload);

    expect(game.id).toBe('game-123');
    expect(game.userId).toBe('user-456');
    expect(game.words).toHaveLength(words.length);
    expect(game.words[0]).toEqual({
      word: words[0].word,
      gender: words[0].gender,
      id: words[0].id
    } satisfies Omit<Noun, 'meanings'>);
  });

  it('should allow creating a game without userId (anonymous)', () => {
    const wordsObj = NounsCollectionTestHelper.getNouns();
    const words = Object.values(wordsObj);

    const game = new Game({
      id: 'user-123',
      words: words.map(({ id, word, gender }) => ({ id, word, gender })),
    } satisfies GamePayload);

    expect(game.userId).toBeUndefined();
    expect(game.words[0].word).toBe(game.words[0].word);
  });
});
