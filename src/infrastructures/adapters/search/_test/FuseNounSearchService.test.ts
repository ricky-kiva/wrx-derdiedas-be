import 'reflect-metadata';

import WordNormalizerService from '../../../../applications/ports/search/WordNormalizerService';
import FuseNounSearchService from '../FuseNounSearchService';
import { ServiceUnavailableError } from '../../../../commons/exceptions';
import NounQueryRepository from '../../../../applications/use-cases/noun/NounQueryRepository';
import { NounRawDTO } from '../../../../applications/use-cases/noun/dto/NounRawDTO';
import NounsCollectionTestHelper from '../../../../../tests/NounsCollectionTestHelper';

describe('FuseNounSearchService', () => {
  const rawNouns: NounRawDTO[] = NounsCollectionTestHelper.getPersistedNouns();

  const mockNormalizeMethod: jest.Mock<string, [string]> = jest
    .fn(word => word.toLowerCase());

  const mockNormalizer: WordNormalizerService = {
    normalize: mockNormalizeMethod
  };

  const mockGetRawAllMethod = jest.fn().mockResolvedValue(rawNouns);

  const mockNounQueryRepository: NounQueryRepository = {
    getRawAll: mockGetRawAllMethod
  } as Partial<jest.Mocked<NounQueryRepository>> as NounQueryRepository;

  let fuseNounSearchService: FuseNounSearchService;

  beforeEach(() => {
    fuseNounSearchService = new FuseNounSearchService(mockNormalizer, mockNounQueryRepository);
    
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('initialize', () => {
    it('should load nouns and initialize Fuse index', async () => {
      await fuseNounSearchService.initialize();

      const similarNormalizedChar = 'e';

      if (rawNouns.every(n => n.normalized.includes(similarNormalizedChar))) {
        const fuseServiceProperty = fuseNounSearchService['fuse'];
        const fuseIndexedItems = fuseServiceProperty?.search(similarNormalizedChar);

        expect(mockGetRawAllMethod).toHaveBeenCalled();
        expect(fuseServiceProperty).toBeDefined();
        expect(fuseIndexedItems?.length).toBe(rawNouns.length);
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
      const uninitializedService = new FuseNounSearchService(mockNormalizer, mockNounQueryRepository);
      expect(() => uninitializedService.search('Schauspieler')).toThrow(ServiceUnavailableError);
    });
  });
});
