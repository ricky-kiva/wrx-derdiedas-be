import { NounSetMetadataPayload } from '../src/domains/nounSetMetadata/entities/NounSetMetadata';
import NounSetMetadataModel from '../src/infrastructures/database/mongoose/models/NounSetMetadataModel';

const metadataPayload: NounSetMetadataPayload = { 
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

const NounSetMetadataCollectionTestHelper = {
  getPayload(): NounSetMetadataPayload {
    return metadataPayload;
  },
  async addMetadata(payload: NounSetMetadataPayload=metadataPayload): Promise<void> {
    await NounSetMetadataModel.create(payload);
  },
  async cleanCollection(): Promise<void> {
    await NounSetMetadataModel.deleteMany({});
  }
};

export default NounSetMetadataCollectionTestHelper;
