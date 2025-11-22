import NounsCollectionTestHelper from '../../../../../tests/NounsCollectionTestHelper';
import Noun from '../../../noun/entities/Noun';
import Game, { GamePayload } from '../Game';

describe('Game', () => {
  it('should create a Game object correctly', () => {
    const nounsObj = NounsCollectionTestHelper.getNouns();
    const nouns = Object.values(nounsObj);

    const game = new Game({ id: 'game-123', userId: 'user-456', nouns } satisfies GamePayload);

    expect(game.id).toBe('game-123');
    expect(game.userId).toBe('user-456');
    expect(game.nouns).toHaveLength(nouns.length);
    expect(game.nouns[0]).toEqual({
      id: nouns[0].id,
      gender: nouns[0].gender,
      word: nouns[0].word,
      meanings: nouns[0].meanings
    } satisfies Noun);
  });

  it('should allow creating a game without userId (anonymous)', () => {
    const nounsObj = NounsCollectionTestHelper.getNouns();
    const nouns = Object.values(nounsObj);

    const game = new Game({ nouns, id: 'user-123' } satisfies GamePayload);

    expect(game.userId).toBeUndefined();
  });
});
