import 'reflect-metadata';

import mongoose from 'mongoose';
import NounsCollectionTestHelper from '../../../../tests/NounsCollectionTestHelper';
import connectToDatabase from '../../database/mongoose/connection';
import NounRepositoryMongo from '../NounRepositoryMongo';
import NounModel from '../../database/mongoose/models/NounModel';
import { NounRaw } from '../../../domains/noun/entities/Noun';

describe('NounRepositoryMongo', () => {
  beforeAll(async () => {
    await connectToDatabase();
  });

  afterEach(async () => {
    await NounsCollectionTestHelper.cleanCollection();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('getRawAll', () => {
    it('should return all nouns in raw format with correct fields', async () => {
      const nounRepositoryMongo = new NounRepositoryMongo(NounModel);

      const normalizedNounPayloads: Partial<NounRaw>[] = [
        { word: 'Katze', gender: 'feminine', normalized: 'katze' },
        { word: 'Ei', gender: 'neuter', normalized: 'ei' },
      ];

      for (const noun of normalizedNounPayloads) {
        await NounsCollectionTestHelper.addNoun(noun);
      }

      const results = await nounRepositoryMongo.getRawAll();
      
      for (const result of results) {
        expect(result).toHaveProperty('id');
        expect(result).toHaveProperty('word');
        expect(result).toHaveProperty('gender');
        expect(result).toHaveProperty('normalized');
      }

      expect(results.map(r => r.word).sort())
        .toEqual(['Ei', 'Katze']);
    });

    it('should return empty array when no nouns exist', async () => {
      const nounRepositoryMongo = new NounRepositoryMongo(NounModel);
      
      const rawResults = await nounRepositoryMongo.getRawAll();

      expect(rawResults).toEqual([]);
    });
  });
});
