/* istanbul ignore file */

import { NounPayload, NounRaw } from '../src/domains/noun/entities/Noun';
import NounModel from '../src/infrastructures/database/mongoose/models/NounModel';

const nounPayloads: NounPayload[] = [
  { word: 'Katze', gender: 'feminine', meanings: [] },
  { word: 'Ei', gender: 'neuter', meanings: [] },
  { word: 'Schauspieler', gender: 'masculine', meanings: [] },
  { word: 'Schauspielerin', gender: 'feminine', meanings: [] }
];

const NounsCollectionTestHelper = {
  getPayload(): NounPayload {
    return nounPayloads[0];
  },
  getPayloadArray(): NounPayload[] {
    return nounPayloads;
  },
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
