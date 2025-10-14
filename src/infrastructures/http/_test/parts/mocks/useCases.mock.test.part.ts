import { DependencyContainer } from 'tsyringe';
import { DITokens } from '../../../../../commons/DITokens';
import SearchNounUseCase from '../../../../../applications/use-cases/noun/search/SearchNounUseCase';
import LoginUseCase from '../../../../../applications/use-cases/auth/LoginUseCase';
import LogoutUseCase from '../../../../../applications/use-cases/auth/LogoutUseCase';
import RefreshTokenUseCase from '../../../../../applications/use-cases/auth/token/refresh-token/RefreshTokenUseCase';
import GetLeaderboardUseCase from '../../../../../applications/use-cases/leaderboard/get/GetLeaderboardUseCase';
import SubmitPointUseCase from '../../../../../applications/use-cases/leaderboard/submit-point/SubmitPointUseCase';
import StartGameUseCase from '../../../../../applications/use-cases/game/start/StartGameUseCase';
import SubmitAnswerUseCase from '../../../../../applications/use-cases/game/submit-answer/SubmitAnswerUseCase';
import EndGameUseCase from '../../../../../applications/use-cases/game/end/EndGameUseCase';

export interface TestPartMocks {
  usecases: {
    endGameUC: jest.Mocked<EndGameUseCase>,
    getLeaderboardUC: jest.Mocked<GetLeaderboardUseCase>,
    loginUC: jest.Mocked<LoginUseCase>,
    logoutUC: jest.Mocked<LogoutUseCase>,
    refreshTokenUC: jest.Mocked<RefreshTokenUseCase>,
    seachNounUC: jest.Mocked<SearchNounUseCase>,
    startGameUC: jest.Mocked<StartGameUseCase>,
    submitAnswerUC: jest.Mocked<SubmitAnswerUseCase>,
    submitPointUC: jest.Mocked<SubmitPointUseCase>
  },
  methods: {
    endGameUC: { execute: jest.Mock },
    logoutUC: { execute: jest.Mock },
    getLeaderboardUC: { execute: jest.Mock },
    startGameUC: { execute: jest.Mock },
    submitAnswerUC: { execute: jest.Mock },
    submitPointUC: { execute: jest.Mock }
  }
}

export default function useCasesMockTestPart(testContainer: DependencyContainer): TestPartMocks { 
  const endGameUCExecute = jest.fn();
  const getLeaderboardUCExecute = jest.fn();
  const logoutUCExecute = jest.fn();
  const startGameUCExecute = jest.fn();
  const submitAnswerUCExecute = jest.fn();
  const submitPointUCExecute = jest.fn();

  const endGameUC = {
    execute: endGameUCExecute
  } as unknown as jest.Mocked<EndGameUseCase>;

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

  const startGameUC = { 
    execute: startGameUCExecute 
  } as unknown as jest.Mocked<StartGameUseCase>;

  const submitAnswerUC = { 
    execute: submitAnswerUCExecute 
  } as unknown as jest.Mocked<SubmitAnswerUseCase>;

  const submitPointUC = {
    execute: submitPointUCExecute
  } as unknown as jest.Mocked<SubmitPointUseCase>;

  testContainer.registerInstance(DITokens.EndGameUseCase, endGameUC);
  testContainer.registerInstance(DITokens.GetLeaderboardUseCase, getLeaderboardUC);
  testContainer.registerInstance(DITokens.LoginUseCase, loginUC);
  testContainer.registerInstance(DITokens.LogoutUseCase, logoutUC);
  testContainer.registerInstance(DITokens.RefreshTokenUseCase, refreshTokenUC);
  testContainer.registerInstance(DITokens.SearchNounUseCase, seachNounUC);
  testContainer.registerInstance(DITokens.StartGameUseCase, startGameUC);
  testContainer.registerInstance(DITokens.SubmitAnswerUseCase, submitAnswerUC);
  testContainer.registerInstance(DITokens.SubmitPointUseCase, submitPointUC);

  return { 
    usecases: { 
      endGameUC, getLeaderboardUC, loginUC, logoutUC, refreshTokenUC, seachNounUC, 
      startGameUC, submitAnswerUC, submitPointUC
    },
    methods: {
      endGameUC: { execute: endGameUCExecute },
      logoutUC: { execute: logoutUCExecute },
      getLeaderboardUC: { execute: getLeaderboardUCExecute },
      startGameUC: { execute: startGameUCExecute },
      submitAnswerUC: { execute: submitAnswerUCExecute },
      submitPointUC: { execute: submitPointUCExecute }
    }
  };
}
