import mongoose, { Schema, Document, Types } from 'mongoose';
import { GENDER_VALUES, NounParams } from '../../../../domains/noun/entities/Noun';

export interface NounDocument extends Document, Omit<NounParams, 'id'> {
  _id: Types.ObjectId;
}

const nounSchema = new Schema<NounDocument>({
  word: { type: String, required: true },
  gender: { type: String, enum: GENDER_VALUES, required: true }
});

const NounModel = mongoose.model<NounDocument>('Noun', nounSchema);

export default NounModel;
