import mongoose, { Schema, Types } from 'mongoose';
import { UserPayload } from '../../../../domains/user/entities/User';

export interface UserDocument extends Document, UserPayload {
  _id: Types.ObjectId;
}

const userSchema = new Schema<UserDocument>({
  name: { type: String, required: true, minlength: 1, maxlength: 30 },
  googleId: { type: String, unique: true, sparse: true },
  email: { type: String, required: false },
  picture: { type: String, required: false }
});

userSchema.pre('save', function (next) {
  if (this.googleId == null) {
    this.googleId = undefined;
  }
  
  next();
});

const UserModel = mongoose.model<UserDocument>('User', userSchema);

export default UserModel;
