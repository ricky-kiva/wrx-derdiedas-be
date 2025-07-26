import { DependencyContainer } from 'tsyringe';
import { DITokens } from '../../../../../commons/DITokens';
import SearchNounUseCase from '../../../../../applications/use-cases/noun/search/SearchNounUseCase';

export interface TestPartMocks {
  seachNounUC: jest.Mocked<SearchNounUseCase>
}

export default function useCasesMockTestPart(testContainer: DependencyContainer): TestPartMocks {
  const mockExecuteMethod = jest.fn();
  
  const seachNounUC = {
    execute: mockExecuteMethod
  } as unknown as jest.Mocked<SearchNounUseCase>;

  testContainer.registerInstance(DITokens.SearchNounUseCase, seachNounUC);

  return { seachNounUC };
}
