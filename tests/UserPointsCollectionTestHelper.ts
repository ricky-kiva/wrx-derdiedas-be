/* istanbul ignore file */

import mongoose from 'mongoose';
import UserPoint, { UserPointPayload } from '../src/domains/userPoint/entities/UserPoint';
import UserPointModel from '../src/infrastructures/database/mongoose/models/UserPointModel';

const userPoints: UserPoint[] = [
  { userId: new mongoose.Types.ObjectId().toString(), point: 1, updatedAt: new Date() },
  { userId: new mongoose.Types.ObjectId().toString(), point: 2, updatedAt: new Date() },
  { userId: new mongoose.Types.ObjectId().toString(), point: 3, updatedAt: new Date() },
  { userId: new mongoose.Types.ObjectId().toString(), point: 3, updatedAt: new Date() }
];

const userPayloads = [ ...userPoints ];

const UserPointsCollectionTestHelper = {
  getPayloads(): UserPointPayload[] { 
    return userPayloads.map(p => ({ ...p })); 
  },
  getUserPointsWithUserIds(userIds: mongoose.Types.ObjectId[]) {
    return userPoints.map((p, i) => ({
      userId: userIds[i],
      point: p.point,
      updatedAt: p.updatedAt
    }));
  },
  async cleanCollection(): Promise<void> {
    await UserPointModel.deleteMany({});
  }
};

export default UserPointsCollectionTestHelper;
