/* istanbul ignore file */

import { Gender, NounPayload } from '../src/domains/noun/entities/Noun';
import NounModel from '../src/infrastructures/database/mongoose/models/NounModel';

const NounsCollectionTestHelper = {
  async addNoun({ word='Katze', gender='feminine' }: NounPayload): Promise<void> {
    await NounModel.create({ word: word, gender: gender });
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
