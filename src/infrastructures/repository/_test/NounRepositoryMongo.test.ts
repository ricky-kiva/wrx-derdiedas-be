import 'reflect-metadata';

import mongoose from 'mongoose';
import NounsCollectionTestHelper from '../../../../tests/NounsCollectionTestHelper';
import Noun, { NounPayload } from '../../../domains/noun/entities/Noun';
import NounRepositoryMongo from '../NounRepositoryMongo';
import NounModel from '../../database/mongoose/models/NounModel';
import connectToDatabase from '../../database/mongoose/connection';
import { InvariantError, NotFoundError } from '../../../commons/exceptions';

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

  describe('addNoun function', () => {
    it('should persist Noun', async () => {
      const nounPayload: NounPayload = {
        word: 'Katze',
        gender: 'feminine'
      };

      const nounRepositoryMongo = new NounRepositoryMongo(NounModel);

      const noun: Noun = await nounRepositoryMongo.addNoun(nounPayload);

      const nouns = await NounModel.find({ _id: noun.id });

      expect(nouns).toHaveLength(1);
    });

    it('should return the correct Noun', async () => {
      const nounPayload: NounPayload = {
        word: 'Katze',
        gender: 'feminine'
      };

      const nounRepositoryMongo = new NounRepositoryMongo(NounModel);

      const noun: Noun = await nounRepositoryMongo.addNoun(nounPayload);

      expect(noun).toStrictEqual(new Noun({
        id: noun.id,
        word: noun.word,
        gender: noun.gender
      }));
    });
  });

  describe('getGenderByWord', () => {
    it('should throw NotFoundError when Noun not found', () => {
      const nounRepositoryMongo = new NounRepositoryMongo(NounModel);

      return expect(nounRepositoryMongo.getGenderByWord('Rezy'))
        .rejects.toThrow(NotFoundError);
    });

    it('should return Gender when Noun is found', async () => {
      const nounRepositoryMongo = new NounRepositoryMongo(NounModel);
      const nounPayload: NounPayload = {
        word: 'Katze',
        gender: 'feminine'
      };

      await NounsCollectionTestHelper.addNoun(nounPayload);

      const gender = await nounRepositoryMongo.getGenderByWord(nounPayload.word);
      
      expect(gender).toBe(nounPayload.gender);
    });
  });

  describe('verifyAvailableNoun', () => {
    it('should throw InvariantError when Noun not available', async () => {
      const nounPayload: NounPayload = {
        word: 'Katze',
        gender: 'feminine'
      };

      await NounsCollectionTestHelper.addNoun(nounPayload);

      const nounRepositoryMongo = new NounRepositoryMongo(NounModel);

      await expect(nounRepositoryMongo.verifyNounAvailability(nounPayload.word))
        .rejects.toThrow(InvariantError);
    });

    it('does not throw InvariantError when Noun is available', async () => {
      const nounRepositoryMongo = new NounRepositoryMongo(NounModel);

      await expect(nounRepositoryMongo.verifyNounAvailability('Katze'))
        .resolves.not.toThrow(InvariantError);
    });
  });
});
