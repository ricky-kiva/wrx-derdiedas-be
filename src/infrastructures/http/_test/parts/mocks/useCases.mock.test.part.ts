import { DependencyContainer } from 'tsyringe';
import { DITokens } from '../../../../../commons/DITokens';
import SearchNounUseCase from '../../../../../applications/use-cases/noun/search/SearchNounUseCase';
import LoginUseCase from '../../../../../applications/use-cases/auth/LoginUseCase';
import LogoutUseCase from '../../../../../applications/use-cases/auth/LogoutUseCase';
import RefreshTokenUseCase from '../../../../../applications/use-cases/auth/token/refresh-token/RefreshTokenUseCase';
import GetLeaderboardUseCase from '../../../../../applications/use-cases/leaderboard/get/GetLeaderboardUseCase';
import SubmitPointUseCase from '../../../../../applications/use-cases/leaderboard/submit-point/SubmitPointUseCase';

export interface TestPartMocks {
  usecases: {
    getLeaderboardUC: jest.Mocked<GetLeaderboardUseCase>,
    loginUC: jest.Mocked<LoginUseCase>,
    logoutUC: jest.Mocked<LogoutUseCase>,
    refreshTokenUC: jest.Mocked<RefreshTokenUseCase>,
    seachNounUC: jest.Mocked<SearchNounUseCase>,
    submitPointUC: jest.Mocked<SubmitPointUseCase>
  },
  methods: {
    logoutUC: { execute: jest.Mock },
    getLeaderboardUC: { execute: jest.Mock },
    submitPointUC: { execute: jest.Mock }
  }
}

export default function useCasesMockTestPart(testContainer: DependencyContainer): TestPartMocks { 
  const logoutUCExecute = jest.fn();
  const getLeaderboardUCExecute = jest.fn();
  const submitPointUCExecute = jest.fn();

  const getLeaderboardUC = {
    execute: getLeaderboardUCExecute
  } as unknown as jest.Mocked<GetLeaderboardUseCase>;
  
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

  const submitPointUC = {
    execute: submitPointUCExecute
  } as unknown as jest.Mocked<SubmitPointUseCase>;

  testContainer.registerInstance(DITokens.GetLeaderboardUseCase, getLeaderboardUC);
  testContainer.registerInstance(DITokens.LoginUseCase, loginUC);
  testContainer.registerInstance(DITokens.LogoutUseCase, logoutUC);
  testContainer.registerInstance(DITokens.RefreshTokenUseCase, refreshTokenUC);
  testContainer.registerInstance(DITokens.SearchNounUseCase, seachNounUC);
  testContainer.registerInstance(DITokens.SubmitPointUseCase, submitPointUC);

  return { 
    usecases: { 
      getLeaderboardUC, loginUC, logoutUC, refreshTokenUC, seachNounUC, submitPointUC
    },
    methods: {
      logoutUC: { execute: logoutUCExecute },
      getLeaderboardUC: { execute: getLeaderboardUCExecute },
      submitPointUC: { execute: submitPointUCExecute }
    }
  };
}
