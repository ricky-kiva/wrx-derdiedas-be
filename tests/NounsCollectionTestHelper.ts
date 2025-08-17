/* istanbul ignore file */

import { NounRawDTO } from '../src/applications/query-repositories/noun/dto/NounRawDTO';
import Noun, { NounPayload } from '../src/domains/noun/entities/Noun';
import NounModel from '../src/infrastructures/database/mongoose/models/NounModel';

const persistedNouns: NounRawDTO[] = [
  { id: 'noun-101', word: 'Katze', gender: 'feminine', normalized: 'katze', meanings: [] },
  { id: 'noun-102', word: 'Ei', gender: 'neuter', normalized: 'ei', meanings: [] },
  { id: 'noun-103', word: 'Schauspieler', gender: 'masculine', normalized: 'schauspieler', meanings: [] },
  { id: 'noun-104', word: 'Schauspielerin', gender: 'feminine', normalized: 'schauspielerin', meanings: [] }
];

const nouns: Noun[] = persistedNouns.map(({ normalized: _, ...rest }) => rest);
const nounPayloads: NounPayload[] = persistedNouns.map(({ id: _, ...rest }) => rest);

const NounsCollectionTestHelper = {
  getPayloads(): NounPayload[] {
    return nounPayloads.map(p => ({ ...p }));
  },
  getPersistedNouns(): NounRawDTO[] {
    return persistedNouns.map(n => ({ ...n }));
  },
  getNouns(): Noun[] {
    return { ...nouns };
  },
  async addNoun(
    payload: Partial<NounRawDTO> = { 
      word: 'Katze', 
      gender: 'feminine',
      normalized: 'katze', 
      meanings: []
    }
  ): Promise<void> {
    await NounModel.create(payload);
  },
  async cleanCollection(): Promise<void> {
    await NounModel.deleteMany({});
  }
};

export default NounsCollectionTestHelper;
