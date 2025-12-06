import fs from 'fs/promises';
import { inject, injectable } from 'tsyringe';
import { DITokens } from '../../../commons/DITokens';
import SeedData from './types/SeedData';
import { NounSetMetadataRepository } from '../../../domains/nounSetMetadata/NounSetMetadataRepository';
import NounRepository from '../../../domains/noun/NounRepository';
import path from 'path';
import config from '../../../commons/config';

@injectable()
export default class NounSeeder {
  constructor(
    @inject(DITokens.NounRepository) private readonly nounRepository: NounRepository,
    @inject(DITokens.NounSetMetadataRepository) private readonly metadataRepository: NounSetMetadataRepository
  ) {}

  async seed() {
    const filePath = path.resolve(process.cwd(), 'data', 'nouns.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const seedData = JSON.parse(fileContent) as SeedData;

    const existingMetadata = await this.metadataRepository.find();

    if (!existingMetadata 
      || existingMetadata.updatedAt !== seedData.metadata.updatedAt
    ) {
      await this.nounRepository.deleteAll();

      const batchSize = 100;
      const seedingStartTime = Date.now();
      const totalData = seedData.data.length;

      for (let i = 0; i < totalData; i += batchSize) {
        const batch = seedData.data.slice(i, i + batchSize);

        await this.nounRepository.insertMany(batch);

        const progress = Math.min(((i + batchSize) / totalData) * 100, 100).toFixed(1);
        const seedingElapsed = Math.round((Date.now() - seedingStartTime) / 1000);

        process.stdout.write(`\rSeeding Nouns data: ${progress}% (${i + batch.length}/${totalData}) | ${seedingElapsed}s`);
      }

      await this.metadataRepository.save(seedData.metadata);

      if (process.env.NODE_ENV === config.env.production) {
        seedData.data = [];
        await fs.writeFile(filePath, JSON.stringify(seedData, null, 2), 'utf-8');
        console.log('Emptied nouns.json data array after seeding');
      }

      const totalElapsed = Math.round((Date.now() - seedingStartTime) / 1000);

      process.stdout.write('\n');
      console.log(`Seeding completed successfully! (${totalElapsed}s)`);
    } else {
      console.log('Nouns are already up to date. Skipping seeding');
    }
  }
}
