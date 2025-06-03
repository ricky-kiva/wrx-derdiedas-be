import Noun, { GENDER_VALUES, NounPayload } from '../Noun';

describe('Noun', () => {
  it('should create an object correctly', () => {
    const payload: NounPayload = {
      word: 'actor',
      gender: 'masculine',
    };

    const noun = new Noun(payload);

    expect(noun.word).toBe('actor');
    expect(noun.gender).toBe('masculine');
  });

  it('accepts all valid gender values', () => {
    GENDER_VALUES.forEach((gender) => {
      const noun = new Noun({ word: 'test', gender });
      expect(noun.gender).toBe(gender);
    });
  });
});
