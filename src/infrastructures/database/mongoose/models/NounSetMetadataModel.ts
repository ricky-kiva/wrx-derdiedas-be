import mongoose, { Schema } from 'mongoose';
import { NounSetMetadataCurator, NounSetMetadataCuratorContacts, NounSetMetadataPayload } from '../../../../domains/nounSetMetadata/entities/NounSetMetadata';

export interface NounSetMetadataDocument extends NounSetMetadataPayload, Document {
  _id: string;
}

const NounSetMetadataCuratorContactsSchema = new Schema<NounSetMetadataCuratorContacts>({
    website: { type: String },
    github: { type: String },
    instagram: { type: String },
    linkedin: { type: String }
  }, { _id: false }
);

const CuratorSchema = new Schema<NounSetMetadataCurator>({
  name: { type: String, required: true },
  role: { type: String, required: true },
  contact: { type: NounSetMetadataCuratorContactsSchema, required: true }
}, { _id: false });

const NounSetMetadataSchema = new Schema<NounSetMetadataDocument>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  version: { type: String, required: true },
  dateCreated: { type: String, required: true },
  dateUpdated: { type: String, required: true },
  description: { type: String, required: true },
  source: { type: String, required: true },
  curator: { type: CuratorSchema, required: true }
});

const NounSetMetadataModel = mongoose.model<NounSetMetadataDocument>('Metadata', NounSetMetadataSchema);

export default NounSetMetadataModel;
