import mongoose, { Schema, Types } from 'mongoose';
import { UserPointPayload } from '../../../../domains/userPoint/entities/UserPoint';

export interface UserPointDocument extends Document, Omit<UserPointPayload, 'userId'> {
  userId: Types.ObjectId;
};

const userPointSchema = new Schema<UserPointDocument>({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true 
  },
  point: { type: Number, default: 0 },
  updatedAt: { type: Date, required: true }
});

const UserPointModel = mongoose.model('UserPoint', userPointSchema);

export default UserPointModel;
