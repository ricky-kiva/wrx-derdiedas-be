import 'reflect-metadata';

import { container } from 'tsyringe';
import { ContainerTokens as Tokens } from '../commons/containerTokens';
import NounRepositoryMongo from './repository/NounRepositoryMongo';
import NounModel from './database/mongoose/models/NounModel';
import WordNormalizerServiceImpl from './adapters/search/WordNormalizerServiceImpl';
import FuseNounSearchService from './adapters/search/FuseNounSearchService';
import SearchNounUseCase from '../applications/use_case/SearchNounUseCase';

container.register(Tokens.SearchNounUseCase, {
  useFactory: (c) => new SearchNounUseCase(
    c.resolve(Tokens.NounSearchService)
  )
});

container.register(Tokens.NounModel, { useValue: NounModel });
container.register(Tokens.NounRepository, { useClass: NounRepositoryMongo });
container.register(Tokens.NounSearchService, { useClass: FuseNounSearchService });
container.register(Tokens.WordNormalizerService, { useClass: WordNormalizerServiceImpl });

export default container;
