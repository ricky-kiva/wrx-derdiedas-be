import { NounRaw } from '../../../domains/noun/entities/Noun';
import SearchResultDTO from '../../dto/SearchResultDTO';

export default interface NounSearchService {
  initialize(): Promise<void>;
  search(normalizedWord: string, limit?: number): SearchResultDTO<NounRaw>[];
}
