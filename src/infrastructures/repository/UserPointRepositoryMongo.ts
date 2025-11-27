import { inject, injectable } from 'tsyringe';
import UserPointRepository from '../../domains/userPoint/UserPointRepository';
import { UserPointPayload } from '../../domains/userPoint/entities/UserPoint';
import { DITokens } from '../../commons/DITokens';
import { Model, Types } from 'mongoose';
import { UserPointDocument } from '../database/mongoose/models/UserPointModel';
import { USER_POINT_CONSTANTS } from '../../domains/userPoint/constants/userPointConstancts';

@injectable()
export default class UserPointRepositoryMongo implements UserPointRepository {
  constructor(
    @inject(DITokens.UserPointModel) 
    private readonly model: Model<UserPointDocument>
  ) {}
  
  async deleteByUserId(userId: string): Promise<void> {
    await this.model.deleteOne({ userId: new Types.ObjectId(userId) });
  }
  
  async save(payload: UserPointPayload): Promise<void> {
    await this.model.findOneAndUpdate(
      { userId: new Types.ObjectId(payload.userId) },
      { point: payload.point, updatedAt: payload.updatedAt },
      { upsert: true }
    );
  }

  async increment(userId: string, amount: number=USER_POINT_CONSTANTS.INCREMENT_POINT): Promise<void> {
    await this.model.updateOne(
      { userId: new Types.ObjectId(userId) },
      {
        $inc: { point: amount },
        $set: { updatedAt: new Date() }
      },
      { upsert: true }
    );
  }

  async decrement(userId: string, amount: number=USER_POINT_CONSTANTS.DECREMENT_POINT, updateTimestamp: boolean=true): Promise<void> {
    const setFields: Record<string, unknown> = {
      point: {
        $max: [
          { $subtract: ["$point", Math.abs(amount)] },
          0
        ]
      }
    };

    if (updateTimestamp) setFields.updatedAt = new Date();
    
    await this.model.updateOne(
      { userId: new Types.ObjectId(userId) },
      [ { $set: setFields } ],
      { upsert: true }
    );
  }
};
