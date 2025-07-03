import { Model } from 'mongoose';
import NounRepository from '../../domains/noun/NounRepository';
import { NounDocument } from '../database/mongoose/models/NounModel';
import { NounPayload, NounRaw } from '../../domains/noun/entities/Noun';
import { inject, injectable } from 'tsyringe';
import { DITokens } from '../../commons/DITokens';
import WordNormalizerService from '../../applications/ports/search/WordNormalizerService';

@injectable()
export default class NounRepositoryMongo implements NounRepository {
  constructor(
    @inject(DITokens.NounModel) private readonly model: Model<NounDocument>,
    @inject(DITokens.WordNormalizerService) private readonly normalizer: WordNormalizerService
  ) {}

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

  async insertMany(nouns: NounPayload[]): Promise<void> {
    await this.model.insertMany(nouns.map(n => ({
      word: n.word,
      gender: n.gender,
      meanings: n.meanings,
      normalized: this.normalizer.normalize(n.word)
    })));
  }

  async deleteAll(): Promise<void> {
    await this.model.deleteMany({});
  }
}
