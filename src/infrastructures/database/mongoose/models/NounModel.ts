import mongoose, { Schema, Document, Types } from 'mongoose';
import { GENDER_VALUES } from '../../../../domains/noun/entities/Noun';
import { NounRawDTO } from '../../../../applications/query-repositories/noun/dto/NounRawDTO';

export interface NounDocument extends Document, Omit<NounRawDTO, 'id'> {
  _id: Types.ObjectId,
}

const nounSchema = new Schema<NounDocument>({
  word: { type: String, required: true },
  gender: { type: String, enum: GENDER_VALUES, required: true },
  meanings: { type: [String], required: true },
  normalized: { type: String, required: true }
});

const NounModel = mongoose.model<NounDocument>('Noun', nounSchema);

export default NounModel;
