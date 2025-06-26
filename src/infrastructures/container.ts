import 'reflect-metadata';

import { container } from 'tsyringe';
import { ContainerTokens as Tokens } from '../commons/containerTokens';
import AddNounUseCase from '../applications/use_case/AddNounUseCase';
import GetGenderByWordUseCase from '../applications/use_case/GetGenderByWordUseCase';
import NounRepositoryMongo from './repository/NounRepositoryMongo';
import NounModel from './database/mongoose/models/NounModel';
import WordNormalizerServiceImpl from './adapters/search/WordNormalizerServiceImpl';
import FuseNounSearchService from './adapters/search/FuseNounSearchService';

container.register(Tokens.AddNounUseCase, {
  useFactory: (c) => new AddNounUseCase(
    c.resolve(Tokens.NounRepository)
  )
});

container.register(Tokens.GetGenderByWordUseCase, {
  useFactory: (c) => new GetGenderByWordUseCase(
    c.resolve(Tokens.NounRepository)
  )
});

container.register(Tokens.NounModel, { useValue: NounModel });
container.register(Tokens.NounRepository, { useClass: NounRepositoryMongo });
container.register(Tokens.NounSearchService, { useClass: FuseNounSearchService });
container.register(Tokens.WordNormalizerService, { useClass: WordNormalizerServiceImpl });

export default container;
