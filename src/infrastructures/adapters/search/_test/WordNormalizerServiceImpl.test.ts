import WordNormalizerServiceImpl from '../WordNormalizerServiceImpl';

describe('WordNormalizerServiceImpl', () => {
  let normalizer: WordNormalizerServiceImpl;

  beforeEach(() => {
    normalizer = new WordNormalizerServiceImpl();
  });

  test('should convert umlauts to base characters', () => {
    expect(normalizer.normalize('Äpfel')).toBe('apfel');
    expect(normalizer.normalize('schön')).toBe('schon');
    expect(normalizer.normalize('für')).toBe('fur');
    expect(normalizer.normalize('straße')).toBe('strasse');
  });

  test('should convert to lowercase', () => {
    expect(normalizer.normalize('Haus')).toBe('haus');
  });

  test('should not modify characters other than umlauts and ß', () => {
    expect(normalizer.normalize('Katze')).toBe('katze');
  });

  test('should handle empty string', () => {
    expect(normalizer.normalize('')).toBe('');
  });
});
