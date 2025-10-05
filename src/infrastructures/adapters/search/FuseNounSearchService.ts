import Fuse from 'fuse.js';
import WordNormalizerService from '../../../applications/ports/search/WordNormalizerService';
import { ServiceUnavailableError } from '../../../commons/exceptions';
import SearchResultDTO from '../../../applications/use-cases/noun/search/dto/SearchResultDTO';
import NounSearchService from '../../../applications/ports/search/NounSearchService';
import { inject, injectable } from 'tsyringe';
import { DITokens } from '../../../commons/DITokens';
import { NounDTO } from '../../../applications/shared/dto/noun/NounDTO';
import NounQueryRepository from '../../../applications/query-repositories/noun/NounQueryRepository';
import { NounRawDTO } from '../../../applications/query-repositories/noun/dto/NounRawDTO';

@injectable()
export default class FuseNounSearchService implements NounSearchService {
  private fuse?: Fuse<NounRawDTO>;

  constructor(
    @inject(DITokens.WordNormalizerService) private readonly normalizer: WordNormalizerService,
    @inject(DITokens.NounQueryRepository) private readonly nounQueryRepository: NounQueryRepository
  ) {}

  async initialize(): Promise<void> {
    const fetchStartTime = Date.now();
    let fetchElapsed = 0;

    const updateFetchInterval = setInterval(() => {
      fetchElapsed = Math.round((Date.now() - fetchStartTime) / 1000);
      process.stdout.write(`\rSearch Service initialization: Fetching nouns.. | ${fetchElapsed}s`);
    }, 1000);

    const searchable: NounRawDTO[] = await this.nounQueryRepository.getRawAll();

    clearInterval(updateFetchInterval);

    process.stdout.write(`\n`);
    console.log(`Search Service initialization: Fetched ${searchable.length} nouns (${fetchElapsed}s)`);

    const batchSize = 100;
    const totalData = searchable.length;
    const indexStartTime = Date.now();

    this.fuse = new Fuse<NounRawDTO>([], {
      keys: ['normalized'],
      threshold: 0.3,
      distance: 100,
      ignoreLocation: true,
      includeScore: true
    });

    for (let i = 0; i < totalData; i += batchSize) {
      const batch = searchable.slice(i, i + batchSize);
      
      for (const item of batch) {
        this.fuse.add(item);
      }
      
      const progress = Math.min(((i + batchSize) / totalData) * 100, 100).toFixed(1);
      const indexElapsed = Math.round((Date.now() - indexStartTime) / 1000);

      process.stdout.write(`\rBuilding Search Service Index: ${progress}% (${i + batch.length}/${totalData}) | ${indexElapsed}s`);
    }

    const totalElapsed = Math.round((Date.now() - fetchStartTime) / 1000);

    process.stdout.write('\n');
    console.log(`Search Service initialization completed successfully! (${totalElapsed}s)`);
  }
  
  search(word: string, limit: number=5): SearchResultDTO<NounDTO>[] {
    if (!this.fuse) throw new ServiceUnavailableError(`${this.constructor.name} not initialized`);

    const normalizedWord = this.normalizer.normalize(word);
    const results = this.fuse.search(normalizedWord);

    return results
      .slice(0, limit)
      .map(result => ({
        item: {
          id: result.item.id,
          word: result.item.word,
          gender: result.item.gender,
          meanings: result.item.meanings
        },
        score: result.score
      }));
  }
}
