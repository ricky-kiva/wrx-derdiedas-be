import 'reflect-metadata';

import mongoose from 'mongoose';
import connectToDatabase from '../../database/mongoose/connection';
import NounSetMetadataCollectionTestHelper from '../../../../tests/NounSetMetadataCollectionTestHelper';
import { NounSetMetadataRepositoryMongo } from '../NounSetMetadataRepositoryMongo';
import NounSetMetadataModel from '../../database/mongoose/models/NounSetMetadataModel';
import { NounSetMetadataPayload } from '../../../domains/nounSetMetadata/entities/NounSetMetadata';

describe('NounSetMetadataRepositoryMongo', () => {
  let repository: NounSetMetadataRepositoryMongo;
  
  const payload: NounSetMetadataPayload = { 
    name: 'derdiedas-dataset',
    version: '1.0.0',
    description: 'A list of German nouns',
    dateCreated: '2025-06-22T12:41+00:00',
    dateUpdated: '2025-07-03T14:00+00:00',
    source: 'https://kaikki.org/',
    curator: {
      name: 'Rickyslash',
      role: 'Processed and transformed noun data',
      contact: {
        website: 'https://rickyslash.my.id/',
        github: 'https://github.com/ricky-kiva',
        instagram: 'https://www.instagram.com/r.ckyslash/',
        linkedin: 'https://www.linkedin.com/in/ricky-fadel/',
      }
    }
  };

  beforeAll(async () => {
    await connectToDatabase();
    repository = new NounSetMetadataRepositoryMongo(NounSetMetadataModel);
  });

  afterEach(async () => {
    await NounSetMetadataCollectionTestHelper.cleanCollection();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('find', () => {
    it('should retrieve metadata correctly', async () => {
      await repository.save(payload);

      const result = await repository.find();

      expect(result).toBeTruthy();
      expect(result?.name).toBe(payload.name);
      expect(result?.dateUpdated).toBe(payload.dateUpdated);
      expect(result?.curator?.name).toBe(payload.curator.name);
      expect(result?.curator?.contact?.github).toBe(payload.curator.contact.github);
    });
  });

  describe('save', () => {
    it('should save metadata', async () => {
      await repository.save(payload);

      const persistedMetadata = await NounSetMetadataModel
        .findById('singleton')
        .lean();

      expect(persistedMetadata).toBeTruthy();
      expect(persistedMetadata?.name).toBe(payload.name);
      expect(persistedMetadata?.dateUpdated).toBe(payload.dateUpdated);
      expect(persistedMetadata?.curator?.name).toBe(payload.curator.name);
      expect(persistedMetadata?.curator?.contact?.github).toBe(payload.curator.contact.github);
    });

    it('should only have one document after multiple saves', async () => {
      const newVersion = '1.1.0';

      await repository.save(payload);
      await repository.save({ ...payload, version: newVersion });

      const result = await repository.find();

      const count = await NounSetMetadataModel.countDocuments();

      expect(result?.version).toBe(newVersion);
      expect(count).toBe(1);
    });
  });
});
