import { container } from 'tsyringe';
import { DITokens } from '../commons/DITokens';
import NounRepositoryMongo from './repository/NounRepositoryMongo';
import NounModel from './database/mongoose/models/NounModel';
import WordNormalizerServiceImpl from './adapters/search/WordNormalizerServiceImpl';
import FuseNounSearchService from './adapters/search/FuseNounSearchService';
import SearchNounUseCase from '../applications/use-cases/noun/search/SearchNounUseCase';
import SearchNounHandler from '../interfaces/http/api/search/handler';
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

container.register(DITokens.SearchNounUseCase, {
  useFactory: (c) => new SearchNounUseCase(
    c.resolve(DITokens.NounSearchService)
  )
});

container.register(DITokens.GoogleAuthService, { useClass: GoogleAuthServiceImpl });
container.register(DITokens.TokenManager, { useClass: JwtTokenManager });
container.register(DITokens.NounRepository, { useClass: NounRepositoryMongo });
container.register(DITokens.NounSeeder, { useClass: NounSeeder });
container.register(DITokens.NounSetMetadataRepository, { useClass: NounSetMetadataRepositoryMongo });
container.register(DITokens.RootHandler, { useClass: RootHandler });
container.register(DITokens.SearchNounHandler, { useClass: SearchNounHandler });
container.register(DITokens.UserRepository, { useClass: UserRepositoryMongo });
container.register(DITokens.WordNormalizerService, { useClass: WordNormalizerServiceImpl });

container.registerInstance(DITokens.NounModel, NounModel);
container.registerInstance(DITokens.NounSetMetadataModel, NounSetMetadataModel);
container.registerInstance(DITokens.RedisClient, redisClient);

container.registerSingleton(DITokens.LoggerService, WinstonLoggerService);
container.registerSingleton(DITokens.LogMW, LogMW);
container.registerSingleton(DITokens.NounSearchService, FuseNounSearchService);
container.registerSingleton(DITokens.TokenStore, RedisTokenStore);

export default container;
