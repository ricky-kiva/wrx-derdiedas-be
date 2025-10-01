import { DependencyContainer } from 'tsyringe';
import { DITokens } from '../../../../../commons/DITokens';
import RootHandler from '../../../../../interfaces/http/api/root/handler';
import SearchHandler from '../../../../../interfaces/http/api/search/handler';
import WinstonLoggerService from '../../../../adapters/logger/WinstonLoggerService';
import LogMW from '../../../../../interfaces/http/middlewares/log/LogMW';
import AuthHandler from '../../../../../interfaces/http/api/auth/handler';
import LeaderboardHandler from '../../../../../interfaces/http/api/leaderboard/handler';

export default function containerRegistersTestPart(testContainer: DependencyContainer) {
  testContainer.register(DITokens.AuthHandler, { useClass: AuthHandler });
  testContainer.register(DITokens.LeaderboardHandler, { useClass: LeaderboardHandler });
  testContainer.register(DITokens.LoggerService, { useClass: WinstonLoggerService });
  testContainer.register(DITokens.LogMW, { useClass: LogMW });
  testContainer.register(DITokens.RootHandler, { useClass: RootHandler });
  testContainer.register(DITokens.SearchHandler, { useClass: SearchHandler });
}
