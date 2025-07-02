import Fuse from 'fuse.js';
import WordNormalizerService from '../../../applications/ports/search/WordNormalizerService';
import { ServiceUnavailableError } from '../../../commons/exceptions';
import SearchResultDTO from '../../../applications/dto/SearchResultDTO';
import NounSearchService from '../../../applications/ports/search/NounSearchService';
import { inject, injectable } from 'tsyringe';
import { DITokens } from '../../../commons/DITokens';
import NounRepository from '../../../domains/noun/NounRepository';
import { NounDTO } from '../../../applications/dto/NounDTO';
import { NounRaw } from '../../../domains/noun/entities/Noun';

@injectable()
export default class FuseNounSearchService implements NounSearchService {
  private fuse?: Fuse<NounRaw>;

  constructor(
    @inject(DITokens.WordNormalizerService) private readonly normalizer: WordNormalizerService,
    @inject(DITokens.NounRepository) private readonly nounRepository: NounRepository
  ) {}

  async initialize(): Promise<void> {
    const searchable: NounRaw[] = await this.nounRepository.getRawAll();

    this.fuse = new Fuse<NounRaw>(searchable, {
      keys: ['normalized'],
      threshold: 0.3,
      distance: 100,
      ignoreLocation: true,
      includeScore: true
    });
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
