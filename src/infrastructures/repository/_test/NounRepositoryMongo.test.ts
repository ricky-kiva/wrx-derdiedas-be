import 'reflect-metadata';

import mongoose from 'mongoose';
import NounsCollectionTestHelper from '../../../../tests/NounsCollectionTestHelper';
import connectToDatabase from '../../database/mongoose/connection';
import NounRepositoryMongo from '../NounRepositoryMongo';
import NounModel from '../../database/mongoose/models/NounModel';
import NounRepository from '../../../domains/noun/NounRepository';
import WordNormalizerServiceImpl from '../../adapters/search/WordNormalizerServiceImpl';

jest.spyOn(console, 'log').mockImplementation(() => {});

describe('NounRepositoryMongo', () => {
  let nounRepository: NounRepository;
  const wordNormalizerService = new WordNormalizerServiceImpl();

  beforeAll(async () => {
    await connectToDatabase();
    nounRepository = new NounRepositoryMongo(NounModel, wordNormalizerService);
  });

  afterEach(async () => {
    await NounsCollectionTestHelper.cleanCollection();
  });

  afterAll(async () => {
    await mongoose.connection.close();
    jest.restoreAllMocks();
  });

  describe('insertMany', () => {
    it('should insert multiple nouns to into the database', async () => {
      const payloads = NounsCollectionTestHelper.getPayloads();

      await nounRepository.insertMany(payloads);

      const found = await NounModel.find({});

      expect(found).toHaveLength(payloads.length);
      expect(found.map(n => n.word).sort())
        .toEqual(payloads.map(p => p.word).sort());
    });
  });

  describe('deleteAll', () => {
    it('should delete all nouns from the database', async () => {
      const payloads = NounsCollectionTestHelper.getPayloads().slice(0, 2);

      await Promise.all(
        payloads.map(p => NounsCollectionTestHelper.addNoun(p))
      );

      const foundBefore = await NounModel.find({});

      expect(foundBefore).toHaveLength(payloads.length);

      await nounRepository.deleteAll();

      const foundAfter = await NounModel.find({});

      expect(foundAfter).toHaveLength(0);
    });
  });
});
