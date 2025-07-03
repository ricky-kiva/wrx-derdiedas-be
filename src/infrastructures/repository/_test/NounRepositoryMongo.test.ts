import 'reflect-metadata';

import mongoose from 'mongoose';
import NounsCollectionTestHelper from '../../../../tests/NounsCollectionTestHelper';
import connectToDatabase from '../../database/mongoose/connection';
import NounRepositoryMongo from '../NounRepositoryMongo';
import NounModel from '../../database/mongoose/models/NounModel';
import { NounRaw } from '../../../domains/noun/entities/Noun';
import NounRepository from '../../../domains/noun/NounRepository';
import WordNormalizerServiceImpl from '../../adapters/search/WordNormalizerServiceImpl';

jest.spyOn(console, 'log').mockImplementation(() => {});

describe('NounRepositoryMongo', () => {
  let repository: NounRepository;
  const wordNormalizerService = new WordNormalizerServiceImpl();

  beforeAll(async () => {
    await connectToDatabase();
    repository = new NounRepositoryMongo(NounModel, wordNormalizerService);
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
      const normalizedNounPayloads: Partial<NounRaw>[] = [
        { word: 'Katze', gender: 'feminine', normalized: 'katze' },
        { word: 'Ei', gender: 'neuter', normalized: 'ei' },
      ];

      for (const noun of normalizedNounPayloads) {
        await NounsCollectionTestHelper.addNoun(noun);
      }

      const results = await repository.getRawAll();
      
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
      const rawResults = await repository.getRawAll();

      expect(rawResults).toEqual([]);
    });
  });
});
