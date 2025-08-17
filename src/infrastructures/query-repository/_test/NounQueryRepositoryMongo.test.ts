import 'reflect-metadata';

import connectToDatabase from '../../database/mongoose/connection';
import NounQueryRepositoryMongo from '../NounQueryRepositoryMongo';
import NounQueryRepository from '../../../applications/query-repositories/noun/NounQueryRepository';
import NounModel from '../../database/mongoose/models/NounModel';
import NounsCollectionTestHelper from '../../../../tests/NounsCollectionTestHelper';
import mongoose from 'mongoose';
import { NounRawDTO } from '../../../applications/query-repositories/noun/dto/NounRawDTO';

jest.spyOn(console, 'log').mockImplementation(() => {});

describe('NounQueryRepositoryMongo', () => {
  let nounQueryRepository: NounQueryRepository;

  beforeAll(async () => {
    await connectToDatabase();
    nounQueryRepository = new NounQueryRepositoryMongo(NounModel);
  });

  afterEach(async () => {
    await NounsCollectionTestHelper.cleanCollection();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    jest.restoreAllMocks();
  });

  describe('getRawAll', () => {
    it('should return all nouns in raw format with correct fields', async () => {
      const normalizedNounPayloads: Partial<NounRawDTO>[] = [
        { word: 'Katze', gender: 'feminine', normalized: 'katze' },
        { word: 'Ei', gender: 'neuter', normalized: 'ei' },
      ];

      for (const noun of normalizedNounPayloads) {
        await NounsCollectionTestHelper.addNoun(noun);
      }

      const results = await nounQueryRepository.getRawAll();
      
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
      const rawResults = await nounQueryRepository.getRawAll();
      expect(rawResults).toEqual([]);
    });
  });
});
