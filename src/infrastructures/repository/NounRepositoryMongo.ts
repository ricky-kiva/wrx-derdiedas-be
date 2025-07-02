import { Model } from 'mongoose';
import NounRepository from '../../domains/noun/NounRepository';
import { NounDocument } from '../database/mongoose/models/NounModel';
import { NounRaw } from '../../domains/noun/entities/Noun';
import { inject, injectable } from 'tsyringe';
import { DITokens } from '../../commons/DITokens';

@injectable()
export default class NounRepositoryMongo implements NounRepository {
  constructor(@inject(DITokens.NounModel) private readonly model: Model<NounDocument>) {}

  async getRawAll(): Promise<NounRaw[]> {
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
