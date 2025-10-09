import { inject, injectable } from 'tsyringe';
import { UserPointQueryRepository } from '../../applications/query-repositories/user-point/UserPointQueryRepository';
import UserPoint from '../../domains/userPoint/entities/UserPoint';
import { DITokens } from '../../commons/DITokens';
import { Model } from 'mongoose';
import { UserPointDocument } from '../database/mongoose/models/UserPointModel';
import UserPointMapper from '../database/mongoose/mappers/UserPointMapper';

@injectable()
export default class UserPointQueryRepositoryMongo implements UserPointQueryRepository {
  constructor(
    @inject(DITokens.UserPointModel) 
    private readonly model: Model<UserPointDocument>
  ) {}

  async findAll(): Promise<UserPoint[]> {
    const docs = await this.model.find({});
    return docs.map((d) => UserPointMapper.toDomain(d));
  }
  
  async findByUserId(userId: string): Promise<UserPoint | null> {
    const doc = await this.model.findOne({ userId });

    if (!doc) return null;

    return UserPointMapper.toDomain(doc);
  }
}
