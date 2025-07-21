import { inject, injectable } from 'tsyringe';
import UserRepository from '../../domains/user/UserRepository';
import User, { UserPayload } from '../../domains/user/entities/User';
import { DITokens } from '../../commons/DITokens';
import { Model } from 'mongoose';
import { UserDocument } from '../database/mongoose/models/UserModel';
import UserMapper from '../database/mongoose/mappers/UserMapper';

@injectable()
export default class UserRepositoryMongo implements UserRepository {
  constructor(
    @inject(DITokens.UserModel) private readonly model: Model<UserDocument>
  ) {}

  async create(payload: UserPayload): Promise<User> {
    const doc = await this.model.create(payload);
    return UserMapper.toDomain(doc);
  }

  async findById(id: string): Promise<User | null> {
    const doc = await this.model.findById(id);
    
    if (!doc) return null;

    return UserMapper.toDomain(doc);
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const doc = await this.model.findOne({ googleId });

    if (!doc) return null;

    return UserMapper.toDomain(doc);
  }

  async findByName(name: string): Promise<User | null> {
    const doc = await this.model.findOne({ name });

    if (!doc) return null;

    return UserMapper.toDomain(doc);
  }
};
