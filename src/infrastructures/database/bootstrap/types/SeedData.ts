import { NounPayload } from '../../../../domains/noun/entities/Noun';
import { NounSetMetadataPayload } from '../../../../domains/nounSetMetadata/entities/NounSetMetadata';

export default interface SeedData {
  metadata: NounSetMetadataPayload
  data: NounPayload[]
}
