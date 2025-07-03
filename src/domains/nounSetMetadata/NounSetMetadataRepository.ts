import NounSetMetadata from './entities/NounSetMetadata';

export interface NounSetMetadataRepository {
  find(): Promise<NounSetMetadata | null>;
  save(metadata: NounSetMetadata): Promise<void>;
}
