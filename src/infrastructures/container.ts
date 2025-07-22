import { container } from 'tsyringe';
import { DITokens } from '../commons/DITokens';
import NounRepositoryMongo from './repository/NounRepositoryMongo';
import NounModel from './database/mongoose/models/NounModel';
import WordNormalizerServiceImpl from './adapters/search/WordNormalizerServiceImpl';
import FuseNounSearchService from './adapters/search/FuseNounSearchService';
import SearchNounUseCase from '../applications/use-cases/noun/search/SearchNounUseCase';
import SearchNounHandler from '../interfaces/http/api/searchNoun/handler';
import RootHandler from '../interfaces/http/api/root/handler';
import NounSetMetadataModel from './database/mongoose/models/NounSetMetadataModel';
import { NounSetMetadataRepositoryMongo } from './repository/NounSetMetadataRepositoryMongo';
import NounSeeder from './database/bootstrap/NounSeeder';
import WinstonLoggerService from './adapters/logger/WinstonLoggerService';
import LogMW from '../interfaces/http/middlewares/log/LogMW';

container.register(DITokens.SearchNounUseCase, {
  useFactory: (c) => new SearchNounUseCase(
    c.resolve(DITokens.NounSearchService)
  )
});

container.register(DITokens.LoggerService, { useClass: WinstonLoggerService });
container.register(DITokens.LogMW, { useClass: LogMW });
container.register(DITokens.NounModel, { useValue: NounModel });
container.register(DITokens.NounRepository, { useClass: NounRepositoryMongo });
container.register(DITokens.NounSeeder, { useClass: NounSeeder });
container.register(DITokens.NounSetMetadataModel, { useValue: NounSetMetadataModel });
container.register(DITokens.NounSetMetadataRepository, { useClass: NounSetMetadataRepositoryMongo });
container.register(DITokens.RootHandler, { useClass: RootHandler });
container.register(DITokens.SearchNounHandler, { useClass: SearchNounHandler });
container.register(DITokens.WordNormalizerService, { useClass: WordNormalizerServiceImpl });

container.registerSingleton(DITokens.NounSearchService, FuseNounSearchService);

export default container;
