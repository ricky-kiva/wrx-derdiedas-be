import fs from 'fs/promises';
import { inject, injectable } from 'tsyringe';
import { DITokens } from '../../../commons/DITokens';
import SeedData from './types/SeedData';
import { NounSetMetadataRepository } from '../../../domains/nounSetMetadata/NounSetMetadataRepository';
import NounRepository from '../../../domains/noun/NounRepository';

@injectable()
export default class NounSeeder {
  constructor(
    @inject(DITokens.NounRepository) private readonly nounRepository: NounRepository,
    @inject(DITokens.NounSetMetadataRepository) private readonly metadataRepository: NounSetMetadataRepository
  ) {}

  async seed(filePath: string) {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const seedData = JSON.parse(fileContent) as SeedData;

    const existingMetadata = await this.metadataRepository.find();

    if (!existingMetadata 
      || existingMetadata.dateUpdated !== seedData.metadata.dateUpdated
    ) {
      console.log('Seeding Nouns..');

      await this.nounRepository.deleteAll();
      await this.nounRepository.insertMany(seedData.data);
      await this.metadataRepository.save(seedData.metadata);

      console.log('Seeding completed successfully');
    } else {
      console.log('Nouns are already up to date. Skipping seeding');
    }
  }
}
