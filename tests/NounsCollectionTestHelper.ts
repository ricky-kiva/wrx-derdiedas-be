/* istanbul ignore file */

import { NounRaw } from '../src/domains/noun/entities/Noun';
import NounModel from '../src/infrastructures/database/mongoose/models/NounModel';

const NounsCollectionTestHelper = {
  async addNoun(
    payload: Partial<NounRaw> = { 
      word: 'Katze', 
      gender: 'feminine',
      normalized: 'katze' 
    }
  ): Promise<void> {
    await NounModel.create(payload);
  },
  async cleanCollection(): Promise<void> {
    await NounModel.deleteMany({});
  }
};

export default NounsCollectionTestHelper;
