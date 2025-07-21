import 'reflect-metadata';

import mongoose from 'mongoose';
import UserPointsCollectionTestHelper from '../../../../tests/UserPointsCollectionTestHelper';
import UsersCollectionTestHelper from '../../../../tests/UsersCollectionTestHelper';
import connectToDatabase from '../../database/mongoose/connection';
import UserPointModel from '../../database/mongoose/models/UserPointModel';
import UserPointRepositoryMongo from '../UserPointRepositoryMongo';
import { UserPointPayload } from '../../../domains/userPoint/entities/UserPoint';

jest.spyOn(console, 'log').mockImplementation(() => {});

describe('UserPointRepositoryMongo', () => {
  let userPointRepositoryMongo: UserPointRepositoryMongo;
  let userId: string;

  beforeAll(async () => {
    await connectToDatabase();

    userPointRepositoryMongo = new UserPointRepositoryMongo(UserPointModel);

    const testUser = await UsersCollectionTestHelper.addUser();

    userId = testUser.id;
  });

  afterEach(async () => {
    await UserPointsCollectionTestHelper.cleanCollection();
  });

  afterAll(async () => {
    await UsersCollectionTestHelper.cleanCollection();
    await mongoose.connection.close();
    
    jest.restoreAllMocks();
  });

  describe('save', () => {
    it('should create new UserPoint if not exists', async () => {
      const payload: UserPointPayload = UserPointsCollectionTestHelper.getPayload({ userId });

      await userPointRepositoryMongo.save(payload);

      const doc = await UserPointModel.findOne({ userId: new mongoose.Types.ObjectId(userId) });

      expect(doc).not.toBeNull();
      expect(doc?.point).toBe(payload.point);
    });

    it('should update existing UserPoint document', async () => {
      const initialPayload: UserPointPayload = UserPointsCollectionTestHelper
        .getPayload({ userId, point: 50, updatedAt: new Date(Date.now() - 3600)});

      await userPointRepositoryMongo.save(initialPayload);

      const updatedPayload: UserPointPayload = UserPointsCollectionTestHelper
        .getPayload({ userId, point: 150, updatedAt: new Date() });

      await userPointRepositoryMongo.save(updatedPayload);

      const doc = await UserPointModel.findOne({ userId: new mongoose.Types.ObjectId(userId) });

      expect(doc).not.toBeNull();
      expect(doc?.point).toBe(updatedPayload.point);
      expect(doc?.updatedAt.getTime()).toBe(updatedPayload.updatedAt.getTime());
    });
  });

  describe('findByUserId', () => {
    it('should return null if user point is not found', async () => {
      const nonexistentUserId = new mongoose.Types.ObjectId().toString();

      const result = await userPointRepositoryMongo.findByUserId(nonexistentUserId);

      expect(result).toBeNull();
    });

    it('should return a UserPoint if found', async () => {
      const payload: UserPointPayload = UserPointsCollectionTestHelper.getPayload({ userId });

      await UserPointModel.create(payload);

      const result = await userPointRepositoryMongo.findByUserId(payload.userId);

      expect(result).not.toBeNull();
      expect(result?.userId).toBe(payload.userId);
      expect(result?.point).toBe(payload.point);
    });
  });
});
