import { NounDTO } from '../../shared/dto/noun/NounDTO';
import SearchResultDTO from '../../use-cases/noun/search/dto/SearchResultDTO';

export default interface NounSearchService {
  initialize(): Promise<void>;
  search(normalizedWord: string, limit?: number): SearchResultDTO<NounDTO>[];
}
