import { inject, injectable } from 'tsyringe';
import NounQueryRepository from '../../applications/query-repositories/noun/NounQueryRepository';
import { DITokens } from '../../commons/DITokens';
import { Model } from 'mongoose';
import { NounDocument } from '../database/mongoose/models/NounModel';
import { NounRawDTO } from '../../applications/query-repositories/noun/dto/NounRawDTO';
import { NounDTO } from '../../applications/shared/dto/noun/NounDTO';

@injectable()
export default class NounQueryRepositoryMongo implements NounQueryRepository {
  constructor(
    @inject(DITokens.NounModel) private readonly model: Model<NounDocument>
  ) {}

  async getRandom(limit?: number): Promise<NounDTO[]> {
    const nouns = await this.model
      .aggregate<NounRawDTO>([
        { $sample: { size: limit ?? 10 } },
        {
          $project: {
            _id: 0, 
            id: '$_id', 
            word: 1,
            gender: 1, 
            meanings: 1,
          }
        }
      ])
      .exec();

    return nouns;
  }

  async getRawAll(): Promise<NounRawDTO[]> {
    const nouns = await this.model.find().lean().exec();
    return nouns.map(n => ({
      id: n._id.toString(),
      word: n.word, 
      gender: n.gender, 
      meanings: n.meanings,
      normalized: n.normalized
    } satisfies NounRawDTO));
  }
}
