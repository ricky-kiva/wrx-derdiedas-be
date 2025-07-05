import 'reflect-metadata';

import * as fs from 'fs/promises';
import NounsCollectionTestHelper from '../../../../../tests/NounsCollectionTestHelper';
import NounSetMetadataCollectionTestHelper from '../../../../../tests/NounSetMetadataCollectionTestHelper';
import NounRepository from '../../../../domains/noun/NounRepository';
import { NounSetMetadataRepository } from '../../../../domains/nounSetMetadata/NounSetMetadataRepository';
import NounSeeder from '../NounSeeder';
import SeedData from '../types/SeedData';
import NounSetMetadata from '../../../../domains/nounSetMetadata/entities/NounSetMetadata';

jest.mock('fs/promises');

describe('NounSeeder', () => {
  let nounRepository: NounRepository;
  let metadataRepository: NounSetMetadataRepository;
  let seeder: NounSeeder;

  const mockSeedData: SeedData = {
    metadata: NounSetMetadataCollectionTestHelper.getPayload(),
    data: NounsCollectionTestHelper.getPayloadArray()
  };

  const mockInsertManyMethod = jest.fn().mockResolvedValue(undefined);
  const mockDeleteAllMethod = jest.fn().mockResolvedValue(undefined);
  const mockFindMethod = jest.fn();
  const mockSaveMethod = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();

    nounRepository = {
      insertMany: mockInsertManyMethod,
      deleteAll: mockDeleteAllMethod
    } as Partial<jest.Mocked<NounRepository>> as NounRepository;

    metadataRepository = {
      find: mockFindMethod,
      save: mockSaveMethod
    } as Partial<jest.Mocked<NounSetMetadataRepository>> as NounSetMetadataRepository;

    (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockSeedData));

    seeder = new NounSeeder(nounRepository, metadataRepository);

    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should seed when no existing metadata', async () => {
    mockFindMethod.mockResolvedValue(null);

    await seeder.seed();

    expect(mockFindMethod).toHaveBeenCalled();
    expect(mockDeleteAllMethod).toHaveBeenCalled();
    expect(mockInsertManyMethod).toHaveBeenCalledTimes(1);
    expect(mockInsertManyMethod).toHaveBeenCalledWith(mockSeedData.data);
    expect(mockInsertManyMethod).toHaveBeenCalledWith(mockSeedData.data);
  });

  it('should seed when dateUpdated metadata is different', async () => {
    mockFindMethod.mockResolvedValue({
      dateUpdated: 'some-date'
    } as Partial<NounSetMetadata> as NounSetMetadata);

    await seeder.seed();

    expect(mockDeleteAllMethod).toHaveBeenCalled();
    expect(mockInsertManyMethod).toHaveBeenCalled();
    expect(mockSaveMethod).toHaveBeenCalled();
  });

  it('should skip seeding when metadata is up to date', async () => {
    mockFindMethod.mockResolvedValue(mockSeedData.metadata);

    await seeder.seed();

    expect(mockDeleteAllMethod).not.toHaveBeenCalled();
    expect(mockInsertManyMethod).not.toHaveBeenCalled();
    expect(mockSaveMethod).not.toHaveBeenCalled();
  });
});
