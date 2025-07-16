import mongoose, { Schema } from 'mongoose';
const userPointSchema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true 
  },
  point: { type: Number, default: 0 }
});

const UserPointModel = mongoose.model('UserPoint', userPointSchema);

export default UserPointModel;
