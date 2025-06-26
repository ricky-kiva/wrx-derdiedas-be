import { NounRaw } from '../../../domains/noun/entities/Noun';
import SearchResultDTO from '../../dto/SearchResultDTO';
import NounSearchService from '../../ports/search/NounSearchService';
import SearchNounUseCase from '../SearchNounUseCase';

describe('SearchNounUseCase', () => {
  it('should orchestrate the action correctly', () => {
    const input = 'Schauspieler';
    const limit = 2;

    const mockResult: SearchResultDTO<NounRaw>[] = [
      {
        item: {
          id: 'noun-101',
          word: 'Schauspieler',
          gender: 'masculine',
          normalized: 'schauspieler'
        },
        score: 0.01
      },
      {
        item: {
          id: 'noun-102',
          word: 'Schauspielerin',
          gender: 'feminine',
          normalized: 'schauspielerin'
        },
        score: 0.02
      }
    ];

    const searchMethodMock = jest.fn().mockReturnValue(mockResult);
    
    const mockNounSearchService: NounSearchService = {
      search: searchMethodMock
    } as Partial<jest.Mocked<NounSearchService>> as NounSearchService;

    const searchNounUseCase = new SearchNounUseCase(mockNounSearchService);

    const result = searchNounUseCase.execute(input, limit);

    expect(result).toStrictEqual(mockResult);
    expect(searchMethodMock).toHaveBeenCalledWith(input, limit);
  });
});
