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

container.register(DITokens.NounSeeder, { useClass: NounSeeder });

container.registerSingleton(DITokens.AuthHandler, AuthHandler);
container.registerSingleton(DITokens.RootHandler, RootHandler);
container.registerSingleton(DITokens.SearchHandler, SearchHandler);
container.registerSingleton(DITokens.TokenManager, JwtTokenManager);
container.registerSingleton(DITokens.WordNormalizerService, WordNormalizerServiceImpl);

container.registerInstance(DITokens.NounModel, NounModel);
container.registerInstance(DITokens.NounSetMetadataModel, NounSetMetadataModel);
container.registerInstance(DITokens.RedisClient, redisClient);

container.registerSingleton(DITokens.GoogleAuthService, GoogleAuthServiceImpl);
container.registerSingleton(DITokens.LeaderboardQueryRepository, LeaderboardQueryRepositoryMongo);
container.registerSingleton(DITokens.LoggerService, WinstonLoggerService);
container.registerSingleton(DITokens.LogMW, LogMW);
container.registerSingleton(DITokens.NounQueryRepository, NounQueryRepositoryMongo);
container.registerSingleton(DITokens.NounRepository, NounRepositoryMongo);
container.registerSingleton(DITokens.NounSearchService, FuseNounSearchService);
container.registerSingleton(DITokens.NounSetMetadataRepository, NounSetMetadataRepositoryMongo);
container.registerSingleton(DITokens.TokenStore, RedisTokenStore);
container.registerSingleton(DITokens.UserRepository, UserRepositoryMongo);

container.register(DITokens.IssueTokenUseCase, {
  useFactory: (c) => new IssueTokenUseCase(
    c.resolve(DITokens.TokenManager),
    c.resolve(DITokens.TokenStore)
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

export default container;
