import { NounDTO } from '../../dto/NounDTO';
import SearchResultDTO from '../../dto/SearchResultDTO';

export default interface NounSearchService {
  initialize(): Promise<void>;
  search(normalizedWord: string, limit?: number): SearchResultDTO<NounDTO>[];
}
