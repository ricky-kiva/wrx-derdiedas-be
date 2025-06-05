import mongoose, { Document } from 'mongoose';
import Noun, { GENDER_VALUES } from '../../../../domains/noun/entities/Noun';

type NounType = (ConstructorParameters<typeof Noun>[0]);

interface NounDocument extends Omit<Document, 'id'>, NounType {}

const nounSchema = new mongoose.Schema<NounDocument>({
  id: { type: String, required: true, unique: true },
  word: { type: String, required: true, unique: true },
  gender: { type: String, enum: GENDER_VALUES, required: true }
});

const NounModel = mongoose.model<NounDocument>('Noun', nounSchema);

export default NounModel;
