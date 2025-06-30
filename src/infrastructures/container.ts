import 'reflect-metadata';

import { container } from 'tsyringe';
import { DITokens } from '../commons/DITokens';
import NounRepositoryMongo from './repository/NounRepositoryMongo';
import NounModel from './database/mongoose/models/NounModel';
import WordNormalizerServiceImpl from './adapters/search/WordNormalizerServiceImpl';
import FuseNounSearchService from './adapters/search/FuseNounSearchService';
import SearchNounUseCase from '../applications/use_case/SearchNounUseCase';
import SearchNounHandler from '../interfaces/http/api/searchNoun/handler';
import RootHandler from '../interfaces/http/api/root/handler';

container.register(DITokens.SearchNounUseCase, {
  useFactory: (c) => new SearchNounUseCase(
    c.resolve(DITokens.NounSearchService)
  )
});

container.register(DITokens.NounModel, { useValue: NounModel });
container.register(DITokens.NounRepository, { useClass: NounRepositoryMongo });
container.register(DITokens.RootHandler, { useClass: RootHandler });
container.register(DITokens.SearchNounHandler, { useClass: SearchNounHandler });
container.register(DITokens.NounSearchService, { useClass: FuseNounSearchService });
container.register(DITokens.WordNormalizerService, { useClass: WordNormalizerServiceImpl });

export default container;
