import { Model } from 'mongoose';
import NounRepository from '../../domains/noun/NounRepository';
import { NounDocument } from '../database/mongoose/models/NounModel';
import Noun, { Gender, NounPayload } from '../../domains/noun/entities/Noun';

export default class NounRepositoryMongo implements NounRepository {
  private readonly model: Model<NounDocument>;
  
  constructor(model: Model<NounDocument>) {
    this.model = model;
  }

  async addNoun(payload: NounPayload): Promise<Noun> {
    const noun = await this.model.create(payload); // TODO: Zod here
    return new Noun({
      id: noun._id.toString(),
      word: noun.word,
      gender: noun.gender
    });
  }

  async getGenderByWord(word: string): Promise<Gender> {
    const noun = await this.model.findOne({ word });
    if (!noun) throw new Error; // TODO: Implements error

    return noun.gender;
  }

  async verifyNounAvailability(word: string): Promise<void> {
    const exists = await this.model.exists({ word });
    if (exists) throw new Error; // TODO: Implements error
  }
}
