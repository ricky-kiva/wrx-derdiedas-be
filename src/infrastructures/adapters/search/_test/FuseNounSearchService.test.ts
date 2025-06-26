import 'reflect-metadata';

import WordNormalizerService from '../../../../applications/ports/search/WordNormalizerService';
import { NounRaw } from '../../../../domains/noun/entities/Noun';
import NounRepository from '../../../../domains/noun/NounRepository';
import FuseNounSearchService from '../FuseNounSearchService';
import { ServiceUnavailableError } from '../../../../commons/exceptions';

describe('FuseNounSearchService', () => {
  const nouns: NounRaw[] = [
    { id: 'noun-101', word: 'Katze', gender: 'feminine', normalized: 'katze' },
    { id: 'noun-102', word: 'Ei', gender: 'neuter', normalized: 'ei' },
    { id: 'noun-103', word: 'Schauspieler', gender: 'masculine', normalized: 'schauspieler' },
    { id: 'noun-104', word: 'Schauspielerin', gender: 'feminine', normalized: 'schauspielerin' }
  ];

  const mockNormalizeMethod: jest.Mock<string, [string]> = jest
    .fn(word => word.toLowerCase());

  const mockNormalizer: WordNormalizerService = {
    normalize: mockNormalizeMethod
  };

  const mockGetRawAllMethod = jest.fn().mockResolvedValue(nouns);

  const mockNounRepository: NounRepository = {
    getRawAll: mockGetRawAllMethod
  } as Partial<jest.Mocked<NounRepository>> as NounRepository;

  let fuseNounSearchService: FuseNounSearchService;

  beforeEach(() => {
    fuseNounSearchService = new FuseNounSearchService(mockNormalizer, mockNounRepository);
  });

  describe('initialize', () => {
    it('should load nouns and initialize Fuse index', async () => {
      await fuseNounSearchService.initialize();

      const similarNormalizedChar = 'e';

      if (nouns.every(n => n.normalized.includes(similarNormalizedChar))) {
        const fuseServiceProperty = fuseNounSearchService['fuse'];
        const fuseIndexedItems = fuseServiceProperty?.search(similarNormalizedChar);

        expect(mockGetRawAllMethod).toHaveBeenCalled();
        expect(fuseServiceProperty).toBeDefined();
        expect(fuseIndexedItems?.length).toBe(nouns.length);
      } else {
        throw new Error('Not all normalized words contain "e". Aborting tests.');
      }
    });
  });

  describe('search', () => {
    beforeEach(async () => {
      await fuseNounSearchService.initialize();
    });

    it('should normalize the word and return limited results', () => {
      const searchWord = 'Schauspieler';

      const results = fuseNounSearchService.search(searchWord);
      const filteredResults = results.filter(r => typeof r.score === 'number' && r.score <= 0.2);

      expect(mockNormalizeMethod).toHaveBeenCalledWith(searchWord);
      expect(filteredResults).toHaveLength(2);
      expect(results[0]).toHaveProperty('item');
      expect(results[0]).toHaveProperty('score');
    });

    it('should throw if it is called before init.', () => {
      const uninitializedService = new FuseNounSearchService(mockNormalizer, mockNounRepository);
      expect(() => uninitializedService.search('Schauspieler')).toThrow(ServiceUnavailableError);
    });
  });
});
