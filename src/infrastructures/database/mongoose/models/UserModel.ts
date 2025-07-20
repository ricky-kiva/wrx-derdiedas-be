import mongoose, { Schema, Types } from 'mongoose';
import { UserPayload } from '../../../../domains/user/entities/User';

export interface UserDocument extends Document, UserPayload {
  _id: Types.ObjectId;
}

const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true },
  googleId: { type: String, required: false },
  email: { type: String, required: false },
  picture: { type: String, required: false }
});

const UserModel = mongoose.model<UserDocument>('User', userSchema);

export default UserModel;
