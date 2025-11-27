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

  beforeAll(async () => {
    await connectToDatabase();

    userPointRepositoryMongo = new UserPointRepositoryMongo(UserPointModel);
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
      const payload: UserPointPayload = UserPointsCollectionTestHelper.getPayloads()[0];

      await userPointRepositoryMongo.save(payload);

      const doc = await UserPointModel.findOne({ userId: new mongoose.Types.ObjectId(payload.userId) });

      expect(doc).not.toBeNull();
      expect(doc?.point).toBe(payload.point);
    });

    it('should update existing UserPoint document', async () => {
      const initialPayload: UserPointPayload = UserPointsCollectionTestHelper.getPayloads()[0];

      await userPointRepositoryMongo.save(initialPayload);

      const updatedPayload: UserPointPayload = {
        userId: initialPayload.userId,
        point: 150,
        updatedAt: new Date()
      };

      await userPointRepositoryMongo.save(updatedPayload);

      const doc = await UserPointModel.findOne({ userId: updatedPayload.userId });

      expect(doc).not.toBeNull();
      expect(doc?.point).toBe(updatedPayload.point);
      expect(doc?.updatedAt.getTime()).toBe(updatedPayload.updatedAt.getTime());
    });
  });

  describe('deleteByUserId', () => {
    it('should delete the UserPoint document by userId', async () => {
      const payload: UserPointPayload = UserPointsCollectionTestHelper.getPayloads()[0];

      await UserPointModel.create(payload);

      const existing = await UserPointModel.findOne({ userId: payload.userId });

      expect(existing).not.toBeNull();

      await userPointRepositoryMongo.deleteByUserId(payload.userId);

      const deleted = await UserPointModel.findOne({ userId: payload.userId });
      
      expect(deleted).toBeNull();
    });

    it('should not throw if userId does not exist', async () => {
      const nonexistentUserId = new mongoose.Types.ObjectId().toString();

      await expect(
        userPointRepositoryMongo.deleteByUserId(nonexistentUserId)
      ).resolves.not.toThrow();
    });
  });

  describe('increment', () => {
    it('should increase point and update updatedAt', async () => {
      const payload: UserPointPayload = UserPointsCollectionTestHelper.getPayloads()[0];
      await UserPointModel.create(payload);

      const before = await UserPointModel.findOne({ userId: payload.userId });
      const beforePoint = before!.point;
      const beforeUpdatedAt = before!.updatedAt;

      await userPointRepositoryMongo.increment(payload.userId, 20);

      const after = await UserPointModel.findOne({ userId: payload.userId });

      expect(after!.point).toBe(beforePoint + 20);
      expect(after!.updatedAt.getTime()).not.toBe(beforeUpdatedAt.getTime());
    });

    it('should create a new document when none exists', async () => {
      const userId = new mongoose.Types.ObjectId().toString();

      await userPointRepositoryMongo.increment(userId, 10);

      const doc = await UserPointModel.findOne({ userId });

      expect(doc).not.toBeNull();
      expect(doc!.point).toBe(10);
      expect(doc!.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('decrement', () => {
    it('should update updatedAt when updateTimestamp = true', async () => {
      const payload: UserPointPayload = UserPointsCollectionTestHelper.getPayloads()[0];
      await UserPointModel.create(payload);

      const before = (await UserPointModel.findOne({ userId: payload.userId }))!.updatedAt;

      await userPointRepositoryMongo.decrement(payload.userId, 10, true);

      const after = (await UserPointModel.findOne({ userId: payload.userId }))!.updatedAt;

      expect(after.getTime()).not.toBe(before.getTime());
    });

    it('should not update updatedAt when updateTimestamp = false', async () => {
      const payload: UserPointPayload = UserPointsCollectionTestHelper.getPayloads()[0];
      await UserPointModel.create(payload);

      const before = (await UserPointModel.findOne({ userId: payload.userId }))!.updatedAt;

      await userPointRepositoryMongo.decrement(payload.userId, 10, false);

      const after = (await UserPointModel.findOne({ userId: payload.userId }))!.updatedAt;

      expect(after.getTime()).toBe(before.getTime());
    });
  });
});
