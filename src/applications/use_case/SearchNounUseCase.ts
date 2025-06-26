import { NounRaw } from '../../domains/noun/entities/Noun';
import SearchResultDTO from '../dto/SearchResultDTO';
import NounSearchService from '../ports/search/NounSearchService';

export default class SearchNounUseCase {
  constructor(private readonly nounSearchService: NounSearchService) {}

  execute(input: string, limit: number=5): SearchResultDTO<NounRaw>[] {
    return this.nounSearchService.search(input, limit);
  }
}
