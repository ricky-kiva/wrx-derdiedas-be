import { container } from 'tsyringe';
import { DITokens } from '../commons/DITokens';
import NounRepositoryMongo from './repository/NounRepositoryMongo';
import NounModel from './database/mongoose/models/NounModel';
import WordNormalizerServiceImpl from './adapters/search/WordNormalizerServiceImpl';
import FuseNounSearchService from './adapters/search/FuseNounSearchService';
import SearchNounUseCase from '../applications/use-cases/noun/search/SearchNounUseCase';
import RootHandler from '../interfaces/http/api/root/handler';
import NounSetMetadataModel from './database/mongoose/models/NounSetMetadataModel';
import { NounSetMetadataRepositoryMongo } from './repository/NounSetMetadataRepositoryMongo';
import NounSeeder from './database/bootstrap/NounSeeder';
import WinstonLoggerService from './adapters/logger/WinstonLoggerService';
import LogMW from '../interfaces/http/middlewares/log/LogMW';
import LoginUseCase from '../applications/use-cases/auth/LoginUseCase';
import UserRepositoryMongo from './repository/UserRepositoryMongo';
import GoogleAuthServiceImpl from './adapters/auth/GoogleAuthServiceImpl';
import IssueTokenUseCase from '../applications/use-cases/auth/token/issue/IssueTokenUseCase';
import redisClient from './database/redis/redisClient';
import JwtTokenManager from './adapters/security/JwtTokenManager';
import RedisTokenStore from './adapters/security/RedisTokenStore';
import LogoutUseCase from '../applications/use-cases/auth/LogoutUseCase';
import RefreshTokenUseCase from '../applications/use-cases/auth/token/refresh-token/RefreshTokenUseCase';
import AuthHandler from '../interfaces/http/api/auth/handler';
import SearchHandler from '../interfaces/http/api/search/handler';
import NounQueryRepositoryMongo from './query-repository/NounQueryRepositoryMongo';
import { LeaderboardQueryRepositoryMongo } from './query-repository/LeaderboardQueryRepositoryMongo';
import GetLeaderboardUseCase from '../applications/use-cases/leaderboard/get/GetLeaderboardUseCase';
import UserModel from './database/mongoose/models/UserModel';
import LeaderboardHandler from '../interfaces/http/api/leaderboard/handler';
import UserPointModel from './database/mongoose/models/UserPointModel';
import SubmitPointUseCase from '../applications/use-cases/leaderboard/submit-point/SubmitPointUseCase';
import UserPointRepositoryMongo from './repository/UserPointRepositoryMongo';
import GameRepositoryRedis from './repository/GameRepositoryRedis';
import HeaderUtils from '../interfaces/http/shared/HeaderUtils';
import GameHandler from '../interfaces/http/api/game/handler';
import StartGameUseCase from '../applications/use-cases/game/start/StartGameUseCase';
import SubmitAnswerUseCase from '../applications/use-cases/game/submit-answer/SubmitAnswerUseCase';
import GameExpirationListener from './database/redis/listeners/game/GameExpirationListener';
import UserPointQueryRepositoryMongo from './query-repository/UserPointQueryRepositoryMongo';
import DecayPointsUseCase from '../applications/use-cases/game/decay-points/DecayPointsUseCase';
import EndGameUseCase from '../applications/use-cases/game/end/EndGameUseCase';
import DeleteUserUseCase from '../applications/use-cases/user/delete/DeleteUserUseCase';
import GetUserPointUseCase from '../applications/use-cases/user/get-point/GetUserPointUseCase';
import UserHandler from '../interfaces/http/api/user/handler';
import UpdateUserUseCase from '../applications/use-cases/user/update/UpdateUserUseCase';
import GetGameByIdUseCase from '../applications/use-cases/game/get/GetGameByIdUseCase';
import UpdateGameUseCase from '../applications/use-cases/game/update/UpdateGameUseCase';
import DeleteGameUseCase from '../applications/use-cases/game/delete/DeleteGameUseCase';
import JwtGameTokenManager from './adapters/security/JwtGameTokenManager';
import IssueGameTokenUseCase from '../applications/use-cases/game/issue-game-token/IssueGameTokenUseCase';

container.register(DITokens.NounSeeder, { useClass: NounSeeder });

container.registerSingleton(DITokens.AuthHandler, AuthHandler);
container.registerSingleton(DITokens.GameExpirationListener, GameExpirationListener);
container.registerSingleton(DITokens.GameHandler, GameHandler);
container.registerSingleton(DITokens.GameTokenManager, JwtGameTokenManager);
container.registerSingleton(DITokens.HeaderUtils, HeaderUtils);
container.registerSingleton(DITokens.LeaderboardHandler, LeaderboardHandler);
container.registerSingleton(DITokens.RootHandler, RootHandler);
container.registerSingleton(DITokens.SearchHandler, SearchHandler);
container.registerSingleton(DITokens.TokenManager, JwtTokenManager);
container.registerSingleton(DITokens.UserHandler, UserHandler);
container.registerSingleton(DITokens.WordNormalizerService, WordNormalizerServiceImpl);

container.registerInstance(DITokens.NounModel, NounModel);
container.registerInstance(DITokens.NounSetMetadataModel, NounSetMetadataModel);
container.registerInstance(DITokens.UserModel, UserModel);
container.registerInstance(DITokens.UserPointModel, UserPointModel);
container.registerInstance(DITokens.RedisClient, redisClient);

container.registerSingleton(DITokens.GameRepository, GameRepositoryRedis);
container.registerSingleton(DITokens.GoogleAuthService, GoogleAuthServiceImpl);
container.registerSingleton(DITokens.LeaderboardQueryRepository, LeaderboardQueryRepositoryMongo);
container.registerSingleton(DITokens.LoggerService, WinstonLoggerService);
container.registerSingleton(DITokens.LogMW, LogMW);
container.registerSingleton(DITokens.NounQueryRepository, NounQueryRepositoryMongo);
container.registerSingleton(DITokens.NounRepository, NounRepositoryMongo);
container.registerSingleton(DITokens.NounSearchService, FuseNounSearchService);
container.registerSingleton(DITokens.NounSetMetadataRepository, NounSetMetadataRepositoryMongo);
container.registerSingleton(DITokens.TokenStore, RedisTokenStore);
container.registerSingleton(DITokens.UserPointQueryRepository, UserPointQueryRepositoryMongo);
container.registerSingleton(DITokens.UserPointRepository, UserPointRepositoryMongo);
container.registerSingleton(DITokens.UserRepository, UserRepositoryMongo);

container.register(DITokens.DecayPointsUseCase, {
  useFactory: (c) => new DecayPointsUseCase(
    c.resolve(DITokens.UserPointQueryRepository),
    c.resolve(DITokens.UserPointRepository),
    c.resolve(DITokens.UserRepository)
  )
});

container.register(DITokens.DeleteGameUseCase, {
  useFactory: (c) => new DeleteGameUseCase(
    c.resolve(DITokens.GameRepository),
    c.resolve(DITokens.GameTokenManager)
  )
});

container.register(DITokens.DeleteUserUseCase, {
  useFactory: (c) => new DeleteUserUseCase(
    c.resolve(DITokens.UserRepository),
    c.resolve(DITokens.UserPointRepository)
  )
});

container.register(DITokens.EndGameUseCase, {
  useFactory: (c) => new EndGameUseCase(
    c.resolve(DITokens.GameRepository),
    c.resolve(DITokens.GameTokenManager),
    c.resolve(DITokens.UserPointRepository),
    c.resolve(DITokens.UserRepository)
  )
});

container.register(DITokens.GetGameByIdUseCase, {
  useFactory: (c) => new GetGameByIdUseCase(
    c.resolve(DITokens.GameRepository)
  )
});

container.register(DITokens.GetLeaderboardUseCase, {
  useFactory: (c) => new GetLeaderboardUseCase(
    c.resolve(DITokens.LeaderboardQueryRepository)
  )
});

container.register(DITokens.GetUserPointUseCase, {
  useFactory: (c) => new GetUserPointUseCase(
    c.resolve(DITokens.UserPointQueryRepository),
    c.resolve(DITokens.UserRepository)
  )
});

container.register(DITokens.IssueTokenUseCase, {
  useFactory: (c) => new IssueTokenUseCase(
    c.resolve(DITokens.TokenManager),
    c.resolve(DITokens.TokenStore)
  )
});

container.register(DITokens.IssueGameTokenUseCase, {
  useFactory: (c) => new IssueGameTokenUseCase(
    c.resolve(DITokens.GameTokenManager)
  )
});

container.register(DITokens.LoginUseCase, {
  useFactory: (c) => new LoginUseCase(
    c.resolve(DITokens.GoogleAuthService),
    c.resolve(DITokens.IssueTokenUseCase),
    c.resolve(DITokens.UserRepository)
  )
});

container.register(DITokens.LogoutUseCase, {
  useFactory: (c) => new LogoutUseCase(
    c.resolve(DITokens.TokenStore)
  )
});

container.register(DITokens.RefreshTokenUseCase, {
  useFactory: (c) => new RefreshTokenUseCase(
    c.resolve(DITokens.TokenManager),
    c.resolve(DITokens.TokenStore)
  )
});

container.register(DITokens.SearchNounUseCase, {
  useFactory: (c) => new SearchNounUseCase(
    c.resolve(DITokens.NounSearchService)
  )
});

container.register(DITokens.StartGameUseCase, {
  useFactory: (c) => new StartGameUseCase(
    c.resolve(DITokens.GameRepository),
    c.resolve(DITokens.GameTokenManager),
    c.resolve(DITokens.NounQueryRepository)
  )
});

container.register(DITokens.SubmitAnswerUseCase, {
  useFactory: (c) => new SubmitAnswerUseCase(
    c.resolve(DITokens.GameRepository),
    c.resolve(DITokens.GameTokenManager),
    c.resolve(DITokens.NounQueryRepository)
  )
});

container.register(DITokens.SubmitPointUseCase, {
  useFactory: (c) => new SubmitPointUseCase(
    c.resolve(DITokens.UserRepository),
    c.resolve(DITokens.UserPointRepository)
  )
});

container.register(DITokens.UpdateGameUseCase, {
  useFactory: (c) => new UpdateGameUseCase(
    c.resolve(DITokens.GameRepository),
    c.resolve(DITokens.GameTokenManager),
    c.resolve(DITokens.UserRepository)
  )
});

container.register(DITokens.UpdateUserUseCase, {
  useFactory: (c) => new UpdateUserUseCase(
    c.resolve(DITokens.UserRepository)
  )
});

export default container;
