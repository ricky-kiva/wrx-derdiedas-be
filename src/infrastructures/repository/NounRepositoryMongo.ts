import { Model } from 'mongoose';
import NounRepository from '../../domains/noun/NounRepository';
import { NounDocument } from '../database/mongoose/models/NounModel';
import Noun, { Gender, NounPayload, NounRaw } from '../../domains/noun/entities/Noun';
import { NotFoundError, InvariantError } from '../../commons/exceptions';
import { inject, injectable } from 'tsyringe';
import { ContainerTokens as Tokens } from '../../commons/containerTokens';

@injectable()
export default class NounRepositoryMongo implements NounRepository {
  constructor(@inject(Tokens.NounModel) private readonly model: Model<NounDocument>) {}

  async addNoun(payload: NounPayload): Promise<Noun> {
    const noun = await this.model.create(payload); // TODO: Zod here
    return new Noun({
      id: noun._id.toString(),
      word: noun.word,
      gender: noun.gender
    });
  }

  async getRawAll(): Promise<NounRaw[]> {
    const nouns = await this.model.find().lean().exec();
    return nouns.map(n => ({
      id: n._id.toString(),
      word: n.word, 
      gender: n.gender, 
      normalized: n.normalized
    }));
  }

  async getGenderByWord(word: string): Promise<Gender> {
    const noun = await this.model.findOne({ word });
    if (!noun) throw new NotFoundError('Noun not found');

    return noun.gender;
  }

  async verifyNounAvailability(word: string): Promise<void> {
    const exists = await this.model.exists({ word });
    if (exists) throw new InvariantError('Noun already exist');
  }
}
