import { DependencyContainer } from 'tsyringe';
import { DITokens } from '../../../../../commons/DITokens';
import SearchNounUseCase from '../../../../../applications/use-cases/noun/search/SearchNounUseCase';
import LoginUseCase from '../../../../../applications/use-cases/auth/LoginUseCase';
import LogoutUseCase from '../../../../../applications/use-cases/auth/LogoutUseCase';
import RefreshTokenUseCase from '../../../../../applications/use-cases/auth/token/refresh-token/RefreshTokenUseCase';

export interface TestPartMocks {
  usecases: {
    loginUC: jest.Mocked<LoginUseCase>,
    logoutUC: jest.Mocked<LogoutUseCase>,
    refreshTokenUC: jest.Mocked<RefreshTokenUseCase>,
    seachNounUC: jest.Mocked<SearchNounUseCase>
  },
  methods: {
    logoutUC: { execute: jest.Mock }
  }
}

export default function useCasesMockTestPart(testContainer: DependencyContainer): TestPartMocks { 
  const logoutUCExecute = jest.fn();
  
  const loginUC = {
    execute: jest.fn()
  } as unknown as jest.Mocked<LoginUseCase>;

  const logoutUC = {
    execute: logoutUCExecute
  } as unknown as jest.Mocked<LogoutUseCase>;

  const refreshTokenUC = {
    execute: jest.fn()
  } as unknown as jest.Mocked<RefreshTokenUseCase>;
  
  const seachNounUC = {
    execute: jest.fn()
  } as unknown as jest.Mocked<SearchNounUseCase>;

  testContainer.registerInstance(DITokens.SearchNounUseCase, seachNounUC);
  testContainer.registerInstance(DITokens.LoginUseCase, loginUC);
  testContainer.registerInstance(DITokens.LogoutUseCase, logoutUC);
  testContainer.registerInstance(DITokens.RefreshTokenUseCase, refreshTokenUC);

  return { 
    usecases: { loginUC, logoutUC, refreshTokenUC, seachNounUC },
    methods: {
      logoutUC: { execute: logoutUCExecute }
    }
  };
}
