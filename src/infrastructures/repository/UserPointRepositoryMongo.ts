import { inject, injectable } from 'tsyringe';
import UserPointRepository from '../../domains/userPoint/UserPointRepository';
import UserPoint, { UserPointPayload } from '../../domains/userPoint/entities/UserPoint';
import { DITokens } from '../../commons/DITokens';
import { Model, Types } from 'mongoose';
import { UserPointDocument } from '../database/mongoose/models/UserPointModel';
import UserPointMapper from '../database/mongoose/mappers/UserPointMapper';

@injectable()
export default class UserPointRepositoryMongo implements UserPointRepository {
  constructor(
    @inject(DITokens.UserPointModel) 
    private readonly model: Model<UserPointDocument>
  ) {}
  
  async findByUserId(userId: string): Promise<UserPoint | null> {
    const doc = await this.model.findOne({ userId });

    if (!doc) return null;

    return UserPointMapper.toDomain(doc);
  }
  
  async save(payload: UserPointPayload): Promise<void> {
    await this.model.findOneAndUpdate(
      { userId: new Types.ObjectId(payload.userId) },
      { point: payload.point, updatedAt: payload.updatedAt },
      { upsert: true }
    );
  }
};
