/* istanbul ignore file */

import mongoose from 'mongoose';
import { UserPointPayload } from '../src/domains/userPoint/entities/UserPoint';
import UserPointModel from '../src/infrastructures/database/mongoose/models/UserPointModel';

const UserPointsCollectionTestHelper = {
  getPayload({ 
    userId=new mongoose.Types.ObjectId().toString(), 
    point=8, 
    updatedAt=new Date() 
  }): UserPointPayload {
    return { userId, point, updatedAt };
  },
  async cleanCollection(): Promise<void> {
    await UserPointModel.deleteMany({});
  }
};

export default UserPointsCollectionTestHelper;
