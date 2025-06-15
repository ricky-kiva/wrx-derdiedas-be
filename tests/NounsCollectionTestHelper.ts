/* istanbul ignore file */

import { Gender, NounPayload } from '../src/domains/noun/entities/Noun';
import NounModel from '../src/infrastructures/database/mongoose/models/NounModel';

const NounsCollectionTestHelper = {
  async addNoun(
    payload: Partial<NounPayload> = { 
      word: 'Katze', 
      gender: 'feminine' 
    }
  ): Promise<void> {
    await NounModel.create(payload);
  },
  async cleanCollection(): Promise<void> {
    await NounModel.deleteMany({});
  },
  async getGenderByWord(word='Katze'): Promise<Gender | null> {
    const nounJson = await NounModel.findOne({ word: word })
      .lean();

    return nounJson?.gender ?? null;
  }
};

export default NounsCollectionTestHelper;
