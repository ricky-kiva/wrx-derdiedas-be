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
import DeleteUserUseCase from '../../../../../applications/use-cases/user/delete/DeleteUserUseCase';
import GetUserPointUseCase from '../../../../../applications/use-cases/user/get-point/GetUserPointUseCase';
import UpdateUserUseCase from '../../../../../applications/use-cases/user/update/UpdateUserUseCase';

export interface TestPartMocks {
  usecases: {
    deleteUserUC: jest.Mocked<DeleteUserUseCase>,
    endGameUC: jest.Mocked<EndGameUseCase>,
    getLeaderboardUC: jest.Mocked<GetLeaderboardUseCase>,
    getUserPointUC: jest.Mocked<GetUserPointUseCase>,
    loginUC: jest.Mocked<LoginUseCase>,
    logoutUC: jest.Mocked<LogoutUseCase>,
    updateUserUC: jest.Mocked<UpdateUserUseCase>,
    refreshTokenUC: jest.Mocked<RefreshTokenUseCase>,
    seachNounUC: jest.Mocked<SearchNounUseCase>,
    startGameUC: jest.Mocked<StartGameUseCase>,
    submitAnswerUC: jest.Mocked<SubmitAnswerUseCase>,
    submitPointUC: jest.Mocked<SubmitPointUseCase>,
  },
  methods: {
    deleteUserUC: { execute: jest.Mock },
    endGameUC: { execute: jest.Mock },
    logoutUC: { execute: jest.Mock },
    getUserPointUC: { execute: jest.Mock },
    getLeaderboardUC: { execute: jest.Mock },
    startGameUC: { execute: jest.Mock },
    submitAnswerUC: { execute: jest.Mock },
    submitPointUC: { execute: jest.Mock },
    updateUserUC: { execute: jest.Mock }
  }
}

export default function useCasesMockTestPart(testContainer: DependencyContainer): TestPartMocks { 
  const deleteUserUCExecute = jest.fn();
  const endGameUCExecute = jest.fn();
  const getLeaderboardUCExecute = jest.fn();
  const getUserPointUCExecute = jest.fn();
  const logoutUCExecute = jest.fn();
  const startGameUCExecute = jest.fn();
  const submitAnswerUCExecute = jest.fn();
  const submitPointUCExecute = jest.fn();
  const updateUserUCExecute = jest.fn();

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

  const updateUserUC = { execute: updateUserUCExecute } as unknown as jest.Mocked<UpdateUserUseCase>;
  const deleteUserUC = { execute: deleteUserUCExecute } as unknown as jest.Mocked<DeleteUserUseCase>;
  const getUserPointUC = { execute: getUserPointUCExecute } as unknown as jest.Mocked<GetUserPointUseCase>;

  testContainer.registerInstance(DITokens.DeleteUserUseCase, deleteUserUC);
  testContainer.registerInstance(DITokens.EndGameUseCase, endGameUC);
  testContainer.registerInstance(DITokens.GetLeaderboardUseCase, getLeaderboardUC);
  testContainer.registerInstance(DITokens.GetUserPointUseCase, getUserPointUC);
  testContainer.registerInstance(DITokens.LoginUseCase, loginUC);
  testContainer.registerInstance(DITokens.LogoutUseCase, logoutUC);
  testContainer.registerInstance(DITokens.RefreshTokenUseCase, refreshTokenUC);
  testContainer.registerInstance(DITokens.SearchNounUseCase, seachNounUC);
  testContainer.registerInstance(DITokens.StartGameUseCase, startGameUC);
  testContainer.registerInstance(DITokens.SubmitAnswerUseCase, submitAnswerUC);
  testContainer.registerInstance(DITokens.SubmitPointUseCase, submitPointUC);
  testContainer.registerInstance(DITokens.UpdateUserUseCase, updateUserUC);

  return { 
    usecases: { 
      deleteUserUC, endGameUC, getLeaderboardUC, getUserPointUC, loginUC, logoutUC, refreshTokenUC, seachNounUC, 
      startGameUC, submitAnswerUC, submitPointUC, updateUserUC
    },
    methods: {
      deleteUserUC: { execute: deleteUserUCExecute },
      endGameUC: { execute: endGameUCExecute },
      logoutUC: { execute: logoutUCExecute },
      getLeaderboardUC: { execute: getLeaderboardUCExecute },
      getUserPointUC: { execute: getUserPointUCExecute },
      startGameUC: { execute: startGameUCExecute },
      submitAnswerUC: { execute: submitAnswerUCExecute },
      submitPointUC: { execute: submitPointUCExecute },
      updateUserUC: { execute: updateUserUCExecute }, 
    }
  };
}
