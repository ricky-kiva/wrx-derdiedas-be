import Noun, { GENDER_VALUES, NounParams, NounPayload } from '../Noun';

describe('Noun', () => {
  it('should create an object correctly', () => {
    const nounPayload: NounPayload = {
      word: 'actor',
      gender: 'masculine',
    };

    const nounParams: NounParams = {
      ...nounPayload,
      id: 'noun-123'
    };

    const noun = new Noun(nounParams);

    expect(noun.word).toBe('actor');
    expect(noun.gender).toBe('masculine');
  });

  it('accepts all valid gender values', () => {
    GENDER_VALUES.forEach((gender) => {
      const noun = new Noun({ id: 'noun-123', word: 'test', gender });
      expect(noun.gender).toBe(gender);
    });
  });
});
