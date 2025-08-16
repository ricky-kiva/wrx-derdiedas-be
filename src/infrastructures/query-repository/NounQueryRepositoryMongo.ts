import { inject, injectable } from 'tsyringe';
import NounQueryRepository from '../../applications/use-cases/noun/NounQueryRepository';
import { DITokens } from '../../commons/DITokens';
import { Model } from 'mongoose';
import { NounDocument } from '../database/mongoose/models/NounModel';
import { NounRawDTO } from '../../applications/use-cases/noun/dto/NounRawDTO';

@injectable()
export default class NounQueryRepositoryMongo implements NounQueryRepository {
  constructor(
    @inject(DITokens.NounModel) private readonly model: Model<NounDocument>
  ) {}

  async getRawAll(): Promise<NounRawDTO[]> {
    const nouns = await this.model.find().lean().exec();
    return nouns.map(n => ({
      id: n._id.toString(),
      word: n.word, 
      gender: n.gender, 
      meanings: n.meanings,
      normalized: n.normalized
    }));
  }
}
