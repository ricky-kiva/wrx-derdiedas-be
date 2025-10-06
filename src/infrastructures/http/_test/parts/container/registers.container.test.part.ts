import { DependencyContainer } from 'tsyringe';
import { DITokens } from '../../../../../commons/DITokens';
import RootHandler from '../../../../../interfaces/http/api/root/handler';
import SearchHandler from '../../../../../interfaces/http/api/search/handler';
import WinstonLoggerService from '../../../../adapters/logger/WinstonLoggerService';
import LogMW from '../../../../../interfaces/http/middlewares/log/LogMW';
import AuthHandler from '../../../../../interfaces/http/api/auth/handler';
import LeaderboardHandler from '../../../../../interfaces/http/api/leaderboard/handler';
import GameHandler from '../../../../../interfaces/http/api/game/handler';
import HeaderUtils from '../../../../../interfaces/http/shared/HeaderUtils';
import JwtTokenManager from '../../../../adapters/security/JwtTokenManager';

export default function containerRegistersTestPart(testContainer: DependencyContainer) {
  testContainer.registerSingleton(DITokens.AuthHandler, AuthHandler);
  testContainer.registerSingleton(DITokens.GameHandler, GameHandler);
  testContainer.registerSingleton(DITokens.HeaderUtils, HeaderUtils);
  testContainer.registerSingleton(DITokens.LeaderboardHandler, LeaderboardHandler);
  testContainer.registerSingleton(DITokens.LoggerService, WinstonLoggerService);
  testContainer.registerSingleton(DITokens.LogMW, LogMW);
  testContainer.registerSingleton(DITokens.RootHandler, RootHandler);
  testContainer.registerSingleton(DITokens.SearchHandler, SearchHandler);
  testContainer.registerSingleton(DITokens.TokenManager, JwtTokenManager);
}
