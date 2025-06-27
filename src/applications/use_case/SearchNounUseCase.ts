import { NounDTO } from '../dto/NounDTO';
import SearchResultDTO from '../dto/SearchResultDTO';
import NounSearchService from '../ports/search/NounSearchService';

export default class SearchNounUseCase {
  constructor(private readonly nounSearchService: NounSearchService) {}

  execute(input: string, limit?: number): SearchResultDTO<NounDTO>[] {
    return this.nounSearchService.search(input, limit);
  }
}
