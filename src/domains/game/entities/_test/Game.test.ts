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
      nouns: words.map(({ id, gender }) => ({ id, gender })),
    } satisfies GamePayload);

    expect(game.id).toBe('game-123');
    expect(game.userId).toBe('user-456');
    expect(game.nouns).toHaveLength(words.length);
    expect(game.nouns[0]).toEqual({
      gender: words[0].gender,
      id: words[0].id
    } satisfies Omit<Noun, 'meanings' | 'word'>);
  });

  it('should allow creating a game without userId (anonymous)', () => {
    const wordsObj = NounsCollectionTestHelper.getNouns();
    const words = Object.values(wordsObj);

    const game = new Game({
      id: 'user-123',
      nouns: words.map(({ id, gender }) => ({ id, gender })),
    } satisfies GamePayload);

    expect(game.userId).toBeUndefined();
  });
});
