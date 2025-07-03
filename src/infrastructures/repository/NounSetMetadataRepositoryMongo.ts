import { inject, injectable } from 'tsyringe';
import { NounSetMetadataRepository } from '../../domains/nounSetMetadata/NounSetMetadataRepository';
import { DITokens } from '../../commons/DITokens';
import { Model } from 'mongoose';
import { NounSetMetadataDocument } from '../database/mongoose/models/NounSetMetadataModel';
import { NounSetMetadataPayload } from '../../domains/nounSetMetadata/entities/NounSetMetadata';

@injectable()
export class NounSetMetadataRepositoryMongo implements NounSetMetadataRepository {
  private readonly id = 'singleton';

  constructor(
    @inject(DITokens.NounSetMetadataModel) 
    private readonly model: Model<NounSetMetadataDocument>
  ) {}
  
  async find() {
    const doc = await this.model.findById(this.id).exec();
    return doc?.toObject() ?? null;
  }
  
  async save(metadata: NounSetMetadataPayload) {
    await this.model.findByIdAndUpdate(
      this.id,
      { _id: 'singleton', ...metadata }, 
      { upsert: true }
    ).exec();
  }
}
